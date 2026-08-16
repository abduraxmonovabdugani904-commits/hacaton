import { Component } from 'react'
import { Heart } from 'lucide-react'
import Button from './Button'
import { translate, currentLang } from '../../utils/i18n'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      const lang = currentLang()
      return (
        <div className="flex min-h-screen items-center justify-center bg-canvas p-6 dark:bg-night">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 text-center shadow-soft dark:border-night-line dark:bg-night-soft">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary-deep dark:bg-primary/15 dark:text-primary">
              <Heart size={24} fill="currentColor" />
            </div>
            <h1 className="text-lg font-bold">{translate(lang, 'err.title')}</h1>
            <p className="mt-2 text-sm leading-relaxed text-mute dark:text-slate-400">
              {translate(lang, 'err.desc')}
            </p>
            <Button className="mt-6 w-full" onClick={() => window.location.reload()}>
              {translate(lang, 'err.reload')}
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
