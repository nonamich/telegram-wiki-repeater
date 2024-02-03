import path from 'node:path';

import dotenv from 'dotenv';

dotenv.config({
  path: path.join(path.parse(__filename).dir, '../.env.development'),
});
