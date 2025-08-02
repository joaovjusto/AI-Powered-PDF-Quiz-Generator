import Image from 'next/image'

export function Logo() {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-2">
      <Image
        src="/logo.svg"
        alt="Unstuck Quiz Generator Logo"
        width={28}
        height={28}
        className="w-10 h-10 sm:w-8 sm:h-8"
      />
      <span className="text-[28px] sm:text-[38px] font-semibold text-gray-900 leading-none font-sans text-center">
        Unstuck Quiz Generator
      </span>
    </div>
  )
}