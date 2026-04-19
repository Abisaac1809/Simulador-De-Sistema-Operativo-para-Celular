import { io, Socket } from 'socket.io-client'

// If VITE_SERVER_URL is set (e.g. in .env), use it.
// Otherwise derive the host from wherever the page was served — so any device
// on the local network that opens http://<machine-ip>:5174 will automatically
// reach the backend at <machine-ip>:3000 without any manual configuration.
const SERVER_URL: string =
  import.meta.env.VITE_SERVER_URL ?? `http://${window.location.hostname}:3000`

export const socket: Socket = io(SERVER_URL, {
  withCredentials: true,
  autoConnect: false,
})

export const SERVER_BASE_URL = SERVER_URL
