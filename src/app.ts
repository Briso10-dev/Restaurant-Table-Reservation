// src/app.ts
// Lancement du serveur
import { envs } from './core/config/env';
import app from './server.config';
import chalk from 'chalk'

app.listen(envs.PORT, () => {
	console.log(chalk.green(`Server running on port http://localhost:${envs.PORT}/`))
	console.log(chalk.whiteBright(`Documentation  : http://localhost:${envs.PORT}/api-docs`))
});


