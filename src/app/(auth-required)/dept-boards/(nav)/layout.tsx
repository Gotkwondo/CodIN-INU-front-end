import DeptBoardsHeader from './header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DeptBoardsHeader>{children}</DeptBoardsHeader>
    </>
  );
}
