'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Smartphone, 
  Monitor, 
  Download, 
  Chrome,
  Shield,
  Zap,
  Globe,
  QrCode,
  ArrowRight,
  Check,
  Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Navigation } from '@/components/navigation'

// Simple Providers component for static export
function SimpleProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// Android icon component
function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.523 15.341c-.5 0-.906.406-.906.906s.406.906.906.906.906-.406.906-.906-.406-.906-.906-.906m-11.046 0c-.5 0-.906.406-.906.906s.406.906.906.906.906-.406.906-.906-.406-.906-.906-.906m11.405-6.024l1.954-3.384c.109-.189.046-.431-.143-.54-.189-.108-.432-.046-.54.143l-1.979 3.427C15.585 8.318 13.855 7.929 12 7.929c-1.855 0-3.585.389-5.174 1.034L4.847 5.536c-.108-.189-.351-.251-.54-.143-.189.109-.252.351-.143.54l1.954 3.384C2.64 11.064.5 14.481.5 18.469h23c0-3.988-2.14-7.405-5.618-9.152"/>
    </svg>
  )
}

// Windows icon component  
function WindowsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
    </svg>
  )
}

// Linux icon component
function LinuxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.002c-.06.209-.218.403-.487.534-.269.135-.596.2-.978.2-.38 0-.807-.065-1.27-.135l-.214-.035c-.344-.067-.637-.135-.904-.267-.268-.135-.467-.335-.614-.467l-.002-.002h-.002c-.014-.02-.025-.039-.036-.059a.792.792 0 00-.086-.082v-.003c-.148-.134-.282-.333-.36-.467l-.003-.004a.402.402 0 01-.087-.266v-.002c0-.114.038-.135.106-.135l.003.002.003.002c.018.016.036.015.054.027.038.024.077.043.117.064.122.064.257.135.4.2.143.066.286.134.446.134h.109c.071 0 .135-.017.198-.067.064-.049.12-.135.139-.27v-.003c.032-.197.012-.401-.056-.601a1.66 1.66 0 00-.26-.534 3.36 3.36 0 00-.365-.401l-.075-.066a.063.063 0 00-.013-.009c-.15-.134-.252-.467-.253-.935-.001-.467.106-1.002.293-1.535.187-.534.436-1.068.716-1.535.28-.466.588-.866.893-1.067l.003-.003c.018-.016.031-.033.049-.05.015-.015.028-.03.039-.05l.002-.002.002-.002a.14.14 0 00.024-.064c.007-.024.013-.049.018-.074h.002c.008-.053.007-.107-.003-.159-.01-.053-.024-.105-.046-.158a.807.807 0 00-.154-.267c-.06-.067-.122-.135-.2-.2-.156-.133-.344-.266-.55-.398-.311-.2-.641-.398-.96-.535v.002a6.497 6.497 0 00-1.135-.467c-.379-.2-.773-.335-1.19-.47-.2-.065-.467-.135-.697-.199h-.004l-.003-.002-.004-.002h-.003a.402.402 0 01-.266-.333c0-.136.04-.2.106-.267.066-.066.138-.098.213-.098zm-2.25 3.683c.212 0 .439.031.68.102.24.07.486.163.716.279.23.116.444.256.62.42.088.082.173.171.242.27.068.099.12.207.143.325.023.118.01.25-.04.37-.05.12-.14.233-.253.332a1.493 1.493 0 01-.401.254 2.6 2.6 0 01-.476.163c-.327.073-.683.091-1.02.04a2.416 2.416 0 01-.476-.12 1.658 1.658 0 01-.416-.215 1.046 1.046 0 01-.3-.331.842.842 0 01-.106-.424c0-.123.028-.244.08-.357a1.15 1.15 0 01.232-.31c.104-.094.221-.175.348-.241.127-.066.262-.117.4-.154.207-.056.42-.087.627-.103zm.093.666a.96.96 0 00-.357.074.691.691 0 00-.27.185.416.416 0 00-.103.257c-.001.088.033.177.103.257a.72.72 0 00.287.188c.119.048.252.073.388.073.136 0 .267-.024.383-.07a.704.704 0 00.283-.182.418.418 0 00.109-.263.4.4 0 00-.098-.253.667.667 0 00-.275-.188.928.928 0 00-.37-.075.93.93 0 00-.08-.003z"/>
    </svg>
  )
}

const features = [
  {
    icon: Zap,
    title: 'Sincronizacao Instantanea',
    description: 'Seus dados sincronizam em tempo real entre todos os dispositivos',
  },
  {
    icon: Shield,
    title: 'Login Seguro por QR',
    description: 'Faca login no desktop escaneando um QR code com seu celular',
  },
  {
    icon: Globe,
    title: 'Acesso Offline',
    description: 'Continue usando o app mesmo sem conexao com a internet',
  },
]

const platforms = {
  android: {
    name: 'Android',
    icon: AndroidIcon,
    version: '1.0.0',
    size: '45 MB',
    requirements: 'Android 8.0+',
    downloads: [
      { label: 'Google Play', url: '#', badge: 'Recomendado' },
      { label: 'APK Direto', url: '#', badge: null },
    ],
  },
  windows: {
    name: 'Windows',
    icon: WindowsIcon,
    version: '0.1.0',
    size: '175 MB',
    requirements: 'Windows 10+',
    downloads: [
      { label: 'Instalador', url: '/Galaxy SpaceCrafts-0.1.0-x64.exe', badge: 'Recomendado' },
    ],
  },
}

export default function DownloadPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<keyof typeof platforms>('android')
  const platform = platforms[selectedPlatform]
  const PlatformIcon = platform.icon

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
              Apps Nativos
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Baixe o{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Galaxy SpaceCrafts
              </span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Acesse sua frota de qualquer lugar. Apps nativos para Android, Windows, Mac e Linux.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                      <feature.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                      <p className="text-white/60 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Platform Selector */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Escolha sua plataforma</CardTitle>
                <CardDescription className="text-white/60">
                  Selecione o sistema operacional para baixar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedPlatform} onValueChange={(v) => setSelectedPlatform(v as keyof typeof platforms)}>
                  <TabsList className="grid grid-cols-2 bg-white/5">
                    <TabsTrigger value="android" className="data-[state=active]:bg-cyan-500/20">
                      <AndroidIcon className="w-5 h-5" />
                    </TabsTrigger>
                    <TabsTrigger value="windows" className="data-[state=active]:bg-cyan-500/20">
                      <WindowsIcon className="w-5 h-5" />
                    </TabsTrigger>
                  </TabsList>

                  {Object.entries(platforms).map(([key, plat]) => {
                    const Icon = plat.icon
                    return (
                      <TabsContent key={key} value={key} className="mt-6">
                        <div className="space-y-6">
                          {/* Platform Info */}
                          <div className="flex items-center gap-4">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                              <Icon className="w-10 h-10 text-cyan-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{plat.name}</h3>
                              <p className="text-white/60 text-sm">
                                Versao {plat.version} - {plat.size}
                              </p>
                            </div>
                          </div>

                          {/* Requirements */}
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-white/60 text-sm">
                              <span className="text-white/80 font-medium">Requisitos:</span> {plat.requirements}
                            </p>
                          </div>

                          {/* Download Buttons */}
                          <div className="space-y-3">
                            {plat.downloads.map((download, idx) => (
                              <Button
                                key={idx}
                                asChild
                                className={`w-full h-12 ${
                                  idx === 0
                                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600'
                                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                }`}
                              >
                                <a href={download.url}>
                                  <Download className="w-5 h-5 mr-2" />
                                  {download.label}
                                  {download.badge && (
                                    <Badge className="ml-2 bg-white/10 text-white/80 text-xs">
                                      {download.badge}
                                    </Badge>
                                  )}
                                </a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    )
                  })}
                </Tabs>
              </CardContent>
            </Card>

            {/* QR Login Card */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                    <QrCode className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Login por QR Code</CardTitle>
                    <CardDescription className="text-white/60">
                      Conecte-se instantaneamente no desktop
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-white/10">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-full bg-white/5 mb-4">
                      <QrCode className="w-12 h-12 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Login sem digitar senha
                    </h3>
                    <p className="text-white/60 text-sm mb-4">
                      Escaneie o QR code com o app no celular para fazer login no PC ou Mac automaticamente.
                    </p>
                  </div>
                </div>

                {/* How it works */}
                <div className="space-y-3">
                  <p className="text-white/80 text-sm font-medium">Como funciona:</p>
                  
                  {[
                    'Abra o app no seu celular',
                    'Acesse as configuracoes e toque em "Escanear QR"',
                    'Aponte a camera para o QR code na tela do PC',
                    'Confirme o acesso no celular',
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                        <span className="text-cyan-400 text-xs font-bold">{idx + 1}</span>
                      </div>
                      <p className="text-white/70 text-sm">{step}</p>
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <Link href="/auth/login?method=qr">
                    Experimentar Login por QR
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Web Version CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-white/10 backdrop-blur-xl max-w-2xl mx-auto">
              <CardContent className="py-8">
                <Chrome className="w-12 h-12 text-white/80 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Prefere usar no navegador?</h3>
                <p className="text-white/60 mb-6">
                  O Galaxy SpaceCrafts tambem funciona perfeitamente no seu navegador favorito.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="bg-white/10 hover:bg-white/20 border border-white/20">
                    <Link href="/">
                      <Globe className="w-4 h-4 mr-2" />
                      Acessar Web App
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Link href="/auth/sign-up">
                      <Rocket className="w-4 h-4 mr-2" />
                      Criar Conta Gratis
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
