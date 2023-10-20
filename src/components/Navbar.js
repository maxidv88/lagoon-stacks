import Link from "next/link";
import ConnectWallet from "./ConectWallet";

export default function Navbar() {
  return (
    <nav className="flex justify-between p-4 bg-slate-900">
      <ul className="flex justify-center space-x-4 text-white">
        <li>
          <Link href="/" className="hover:text-orange-500">
            Home
          </Link>
        </li>
        <li>
          <Link href="/lend" className="hover:text-orange-500">
            Lend
          </Link>
        </li>
        <li>
          <Link href="/borrow" className="hover:text-orange-500">
            Borrow
          </Link>
        </li>
        <li>
          <Link href="/deposit" className="hover:text-orange-500">
            Deposit BTC
          </Link>
        </li>
        <li>
          <Link href="/withdraw" className="hover:text-orange-500">
            Withdraw sBTC
          </Link>
        </li>
      </ul>

        <ConnectWallet
        />
    </nav>
  );
}