import "../styles/loading.css"

export default function Loading({ 
  variant = "spinner", 
  size = "md", 
  text = "", 
  fullScreen = false 
}) {
  const containerClass = `loading-container ${fullScreen ? 'fullscreen' : ''}`
  
  if (variant === "dots") {
    return (
      <div className={containerClass}>
        <div className={`loading-dots ${size}`}>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={containerClass}>
        <div className={`loading-pulse ${size}`}>
          <div className="pulse-circle"></div>
        </div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    )
  }

  if (variant === "bars") {
    return (
      <div className={containerClass}>
        <div className={`loading-bars ${size}`}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    )
  }

  // Default spinner
  return (
    <div className={containerClass}>
      <div className={`loading-spinner ${size}`}>
        <div className="spinner-circle"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  )
}