import { CONFIG } from 'src/config-global';

import { UserFormView } from 'src/sections/user/user-form-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Usuario - ${CONFIG.appName}`}</title>

      <UserFormView />
    </>
  );
}
