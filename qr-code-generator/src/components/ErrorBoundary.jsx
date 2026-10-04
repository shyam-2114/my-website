import { Component } from 'react'
import { AlertOctagon } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Something went wrong.' }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled application error:', error, info)
  }

  handleReload = () => {
    this.setState({ hasError: false, message: '' })
    window.location.hash = 'generator'
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page">
          <div className="card error-boundary">
            <AlertOctagon size={28} />
            <h2 className="card-title">Something went wrong</h2>
            <p>{this.state.message}</p>
            <button type="button" className="btn btn-primary" onClick={this.handleReload}>
              Reload the app
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
