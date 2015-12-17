import fallback from 'express-history-api-fallback';
import express from 'express';

const app = express();
const root = `${__dirname}/../public`;
app.use( express.static( root ) );
app.use( fallback( 'index.html', { root } ) )
app.listen( 3000, () => console.log( 'Example app listening at http://localhost:%s', 3000 ) );
