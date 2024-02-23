import { Trans } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import { UniIcon } from "components/Logo/UniIcon";
import Web3Status from "components/Web3Status";
import { useNewLandingPage } from "featureFlags/flags/landingPageV2";
import { chainIdToBackendName } from "graphql/data/util";
import { useIsLandingPage } from "hooks/useIsLandingPage";
import { useIsNftPage } from "hooks/useIsNftPage";
import { useIsPoolsPage } from "hooks/useIsPoolsPage";
import { Box } from "nft/components/Box";
import { Row } from "nft/components/Flex";
import { useProfilePageState } from "nft/hooks";
import { ReactNode, useCallback } from "react";
import {
  NavLink,
  NavLinkProps,
  useLocation,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";

import { useAccountDrawer } from "components/AccountDrawer/MiniPortfolio/hooks";
import { Chain } from "graphql/data/__generated__/types-and-hooks";
import { useIsNavSearchInputVisible } from "../../nft/hooks/useIsNavSearchInputVisible";
import Blur from "./Blur";
import { ChainSelector } from "./ChainSelector";
import { SearchBar } from "./SearchBar";
import * as styles from "./style.css";

const Nav = styled.nav`
  padding: ${({ theme }) => `${theme.navVerticalPad}px 12px`};
  width: 100%;
  height: ${({ theme }) => theme.navHeight}px;
  z-index: 2;
`;

interface MenuItemProps {
  href: string;
  id?: NavLinkProps["id"];
  isActive?: boolean;
  children: ReactNode;
  dataTestId?: string;
}

const MenuItem = ({
  href,
  dataTestId,
  id,
  isActive,
  children,
}: MenuItemProps) => {
  return (
    <NavLink
      to={href}
      className={isActive ? styles.activeMenuItem : styles.menuItem}
      id={id}
      style={{ textDecoration: "none" }}
      data-testid={dataTestId}
    >
      {children}
    </NavLink>
  );
};

export const PageTabs = () => {
  const { pathname } = useLocation();
  const { chainId: connectedChainId } = useWeb3React();
  const chainName = chainIdToBackendName(connectedChainId);

  const isPoolActive = useIsPoolsPage();

  return (
    <>
      <MenuItem href="/swap" isActive={pathname.startsWith("/swap")}>
        <Trans>Swap</Trans>
      </MenuItem>
      <Box display={{ sm: "flex", lg: "none", xxl: "flex" }} width="full">
        <MenuItem
          href="/pools/v2"
          dataTestId="pool-nav-link"
          isActive={isPoolActive}
        >
          <Trans>Pools</Trans>
        </MenuItem>
      </Box>
    </>
  );
};

const Navbar = ({ blur }: { blur: boolean }) => {
  const isNftPage = useIsNftPage();
  const isLandingPage = useIsLandingPage();
  const isNewLandingPageEnabled = useNewLandingPage();
  const sellPageState = useProfilePageState((state) => state.state);
  const navigate = useNavigate();
  const isNavSearchInputVisible = useIsNavSearchInputVisible();

  const { account } = useWeb3React();
  const [accountDrawerOpen, toggleAccountDrawer] = useAccountDrawer();
  const handleUniIconClick = useCallback(() => {
    if (account) {
      return;
    }
    if (accountDrawerOpen) {
      toggleAccountDrawer();
    }
    navigate({
      pathname: "/",
      search: "?intro=true",
    });
  }, [account, accountDrawerOpen, navigate, toggleAccountDrawer]);

  return (
    <>
      {blur && <Blur />}
      <Nav>
        <Box display="flex" height="full" flexWrap="nowrap">
          <Box className={styles.leftSideContainer}>
            <Box className={styles.logoContainer}>
              <UniIcon
                width="48"
                height="48"
                data-testid="uniswap-logo"
                className={styles.logo}
                clickable={!account}
                onClick={handleUniIconClick}
              />
            </Box>
            {!isNftPage && (
              <Box display={{ sm: "flex", lg: "none" }}>
                <ChainSelector leftAlign={true} />
              </Box>
            )}
            <Row display={{ sm: "none", lg: "flex" }}>
              <PageTabs />
            </Row>
          </Box>
          <Box className={styles.rightSideContainer}>
            <Row gap="12">
              <Box display={{ sm: "none", lg: "flex" }}>
                <ChainSelector />
              </Box>
              <Web3Status />
            </Row>
          </Box>
        </Box>
      </Nav>
    </>
  );
};

export default Navbar;
