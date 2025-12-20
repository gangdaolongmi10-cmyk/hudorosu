import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [healthStatus, setHealthStatus] = useState<string>('')

    useEffect(() => {
        fetch('http://localhost:3000/api/health')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data: { status: string }) => {
                console.log(data);
                setHealthStatus(data.status.toUpperCase())
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setHealthStatus(`Error: ${err.message}`)
            })
    }, [])

    return (
        <div className="App">
            <header className="App-header">
                <p>Vite + React + Express 統合アプリケーション</p>
                <div className="health-status">
                    <h2>バックエンド接続状況</h2>
                    <pre>{healthStatus || '読み込み中...'}</pre>
                </div>
            </header>
        </div>
    )
}

export default App
