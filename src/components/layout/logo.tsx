import { Link } from "@tanstack/react-router";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img
        src="/logo.png"
        alt="فرش مریم"
        width={150}
        height={80}
        className="object-contain"
      />
    </Link>
  )
}
