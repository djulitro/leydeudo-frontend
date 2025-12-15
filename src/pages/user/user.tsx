import { CONFIG } from 'src/config-global';

import { UserView } from 'src/sections/user/user-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Usuarios - ${CONFIG.appName}`}</title>

      <UserView />
    </>
  );
}
