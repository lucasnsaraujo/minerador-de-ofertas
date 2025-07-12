import {
  MonitorIcon,
  LaptopIcon,
  DeviceTabletIcon,
  DeviceMobileIcon,
  AndroidLogoIcon,
  WindowsLogoIcon,
  DesktopIcon,
} from "@phosphor-icons/react"

type Props = {
  className: string
  deviceName: "" | "iPhone" | "iPad" | "Android Device" | "Windows PC" | "Mac" | "Linux PC" | "Chromebook"
}

const DeviceImage = (props: Props) => {
  if (props.deviceName === "iPhone") return <DeviceMobileIcon className={props.className} />
  if (props.deviceName === "Android Device") return <AndroidLogoIcon className={props.className} />
  if (props.deviceName === "iPad") return <DeviceTabletIcon className={props.className} />
  if (props.deviceName === "Windows PC") return <WindowsLogoIcon className={props.className} />
  if (props.deviceName === "Mac") return <DesktopIcon className={props.className} />
  if (props.deviceName === "Linux PC") return <MonitorIcon className={props.className} />
  if (props.deviceName === "Chromebook") return <LaptopIcon className={props.className} />

  return null
}

export default DeviceImage
