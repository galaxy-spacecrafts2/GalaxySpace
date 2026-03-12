'use client'

import { Capacitor } from '@capacitor/core'

// Type definitions for Web USB API
export interface USBDevice {
  deviceId: string
  productName: string
  manufacturerName: string
  serialNumber?: string
}

interface USBInterface {
  interfaceNumber: number
}

interface USBConfiguration {
  interfaces: USBInterface[]
}

interface WebUSBDevice extends USBDevice {
  open(): Promise<void>
  close(): Promise<void>
  claimInterface(interfaceNumber: number): Promise<void>
  configuration?: USBConfiguration
}

interface WebUSB {
  getDevices(): Promise<WebUSBDevice[]>
  requestDevice(options: { filters: Array<{ vendorId: number }> }): Promise<WebUSBDevice>
}

declare global {
  interface Navigator {
    usb?: WebUSB
  }
}

export interface USBPermissionResult {
  granted: boolean
  devices: USBDevice[]
  error?: string
}

// Web USB API implementation
export async function requestUSBPermission(): Promise<USBPermissionResult> {
  try {
    if (!navigator.usb) {
      return {
        granted: false,
        devices: [],
        error: 'USB API not supported in this browser'
      }
    }

    // Request USB device access
    const device = await navigator.usb.requestDevice({
      filters: [
        { vendorId: 0x239A }, // Adafruit
        { vendorId: 0x1BDA }, // Generic USB
        { vendorId: 0x0403 }, // FTDI
        { vendorId: 0x10C4 }, // Silicon Labs
        { vendorId: 0x067B }, // Prolific
        { vendorId: 0x1A86 }, // QinHeng Electronics
      ]
    })

    const usbDevice: USBDevice = {
      deviceId: device.deviceId,
      productName: device.productName || 'Unknown Device',
      manufacturerName: device.manufacturerName || 'Unknown Manufacturer',
      serialNumber: device.serialNumber
    }

    return {
      granted: true,
      devices: [usbDevice]
    }
  } catch (error) {
    console.error('USB permission request failed:', error)
    return {
      granted: false,
      devices: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getConnectedUSBDevices(): Promise<USBDevice[]> {
  try {
    if (!navigator.usb) {
      return []
    }

    const devices = await navigator.usb.getDevices()
    
    return devices.map((device: WebUSBDevice) => ({
      deviceId: device.deviceId,
      productName: device.productName || 'Unknown Device',
      manufacturerName: device.manufacturerName || 'Unknown Manufacturer',
      serialNumber: device.serialNumber
    }))
  } catch (error) {
    console.error('Error getting USB devices:', error)
    return []
  }
}

export async function connectToUSBDevice(deviceId: string): Promise<boolean> {
  try {
    if (!navigator.usb) {
      return false
    }

    const devices = await navigator.usb.getDevices()
    const device = devices.find((d: WebUSBDevice) => d.deviceId === deviceId)
    
    if (!device) {
      return false
    }

    await device.open()
    
    // Try to claim interface for LoRa devices
    if (device.configuration) {
      for (const iface of device.configuration.interfaces) {
        try {
          await device.claimInterface(iface.interfaceNumber)
          console.log(`Claimed interface ${iface.interfaceNumber}`)
        } catch (error) {
          console.log(`Could not claim interface ${iface.interfaceNumber}:`, error)
        }
      }
    }

    return true
  } catch (error) {
    console.error('Error connecting to USB device:', error)
    return false
  }
}

export async function disconnectFromUSBDevice(deviceId: string): Promise<boolean> {
  try {
    if (!navigator.usb) {
      return false
    }

    const devices = await navigator.usb.getDevices()
    const device = devices.find((d: WebUSBDevice) => d.deviceId === deviceId)
    
    if (!device) {
      return false
    }

    await device.close()
    return true
  } catch (error) {
    console.error('Error disconnecting USB device:', error)
    return false
  }
}

// Check if USB API is available
export function isUSBSupported(): boolean {
  return typeof navigator !== 'undefined' && 'usb' in navigator
}

// Check if running in native Android app
export function isNativeAndroid(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android'
}

// For native Android, we would need to implement custom plugin
// This is a placeholder for future native implementation
export async function requestNativeUSBPermission(): Promise<USBPermissionResult> {
  if (!isNativeAndroid()) {
    return {
      granted: false,
      devices: [],
      error: 'Not running on native Android'
    }
  }

  // TODO: Implement native USB plugin
  // This would require a custom Capacitor plugin
  return {
    granted: false,
    devices: [],
    error: 'Native USB implementation not yet available'
  }
}
