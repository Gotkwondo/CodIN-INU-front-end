import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface navProps {
  title: string;
  path: string;
}

export default function TopNav({ nav }: { nav?: navProps[] }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    nav && (
      <nav className="relative flex w-full justify-evenly z-[98] rounded-b-[20px] shadow-[0_5px_13.3px_4px_rgba(212,212,212,0.59)]">
        {nav.map(item => {
          if (item.title === '학과페이지') {
            return (
              <div
                key={item.path}
                // href={item.path}
              >
                <div
                  className="px-[10px] py-[14px] text-[14px] h-[49px] font-bold box-border"
                  style={{
                    color: isActive(item.path) ? 'black' : '#AEAEAE',
                    borderBottom: isActive(item.path)
                      ? '2px solid #0d99ff'
                      : '2px solid transparent',
                  }}
                >
                  {item.title}
                </div>
              </div>
            );
          }
          return (
            <Link
              key={item.path}
              href={item.path}
            >
              <div
                className="px-[10px] py-[14px] text-[14px] h-[49px] font-bold box-border"
                style={{
                  color: isActive(item.path) ? 'black' : '#AEAEAE',
                  borderBottom: isActive(item.path)
                    ? '2px solid #0d99ff'
                    : '2px solid transparent',
                }}
              >
                {item.title}
              </div>
            </Link>
          );
        })}
      </nav>
    )
  );
}
