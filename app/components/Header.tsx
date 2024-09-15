import Image from "next/image";

import Logo from "@/app/public/images/logo-unicorn.png";

export default function Header() {
  return (
    <header className="bg-white py-3 px-5 flex flex-row justify-start items-center gap-4">
      <Image src={Logo} alt="Unicorn" className="w-24 h-auto" />
      <h1 className="text-xl font-semibold text-primary">Unicorn Analytics</h1>
    </header>
  );
}
