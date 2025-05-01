import Error from "./error"

 
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  onClose = () => {
    this.setState({ hasError: false, error: null }); 
    console.log(this.state);

  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{overflow:"auto"}}>
          <Error error={this.state.error} reset={this.resetError} onClose={this.onClose}/>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
