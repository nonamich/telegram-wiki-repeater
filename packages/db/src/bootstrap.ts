import dotenv from 'dotenv';

import path from 'node:path';

dotenv.config({
  path: path.join(path.parse(__filename).dir, '../.env'),
});
