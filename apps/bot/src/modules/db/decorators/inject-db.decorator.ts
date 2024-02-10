import { Inject } from '@nestjs/common';

import { DB_PROVIDER } from '../db.constants';

export const InjectDB = (): ParameterDecorator => Inject(DB_PROVIDER);
