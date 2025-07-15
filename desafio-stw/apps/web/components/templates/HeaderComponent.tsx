import { ConnectionStatus } from "../ConnectionStatus";
import { NavLink } from "../NavLink";
import { ThemeToggle } from "../ThemeToggle";

export function HeaderComponent() {
  return (
    <>
      <header className="flex flex-row justify-around p-4 shadow">
        <h1>Logo</h1>
        <NavLink href="/" label="Dashboard de Monitoramento" />
        <ThemeToggle />
        <ConnectionStatus />
        <NavLink href="/configuracoes" label="Configurações" />
      </header>
    </>
  );
}
