'use client'

import { Capacitor } from '@capacitor/core'
import { Camera, CameraPermissionState, CameraResultType, CameraSource } from '@capacitor/camera'

export interface CameraPermissionResult {
  granted: boolean
  canAskAgain: boolean
  state: CameraPermissionState
}

export async function checkCameraPermission(): Promise<CameraPermissionResult> {
  try {
    if (!Capacitor.isNativePlatform()) {
      // Web platform - check via browser API
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      return { granted: true, canAskAgain: true, state: 'granted' as CameraPermissionState }
    }

    const result = await Camera.checkPermissions()
    return {
      granted: result.camera === 'granted',
      canAskAgain: result.camera !== 'denied',
      state: result.camera
    }
  } catch (error) {
    console.error('Error checking camera permission:', error)
    return { granted: false, canAskAgain: true, state: 'prompt' as CameraPermissionState }
  }
}

export async function requestCameraPermission(): Promise<CameraPermissionResult> {
  try {
    if (!Capacitor.isNativePlatform()) {
      // Web platform - request via browser API
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      return { granted: true, canAskAgain: true, state: 'granted' as CameraPermissionState }
    }

    const result = await Camera.requestPermissions({ permissions: ['camera'] })
    return {
      granted: result.camera === 'granted',
      canAskAgain: result.camera !== 'denied',
      state: result.camera
    }
  } catch (error) {
    console.error('Error requesting camera permission:', error)
    return { granted: false, canAskAgain: false, state: 'denied' as CameraPermissionState }
  }
}

export async function openCamera(): Promise<string | null> {
  try {
    const permission = await checkCameraPermission()
    if (!permission.granted) {
      const requested = await requestCameraPermission()
      if (!requested.granted) {
        throw new Error('Camera permission denied')
      }
    }

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    })

    return image.dataUrl || null
  } catch (error) {
    console.error('Error opening camera:', error)
    return null
  }
}

export async function openPhotoLibrary(): Promise<string | null> {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    })

    return image.dataUrl || null
  } catch (error) {
    console.error('Error opening photo library:', error)
    return null
  }
}
