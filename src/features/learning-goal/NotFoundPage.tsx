import { Link } from 'react-router-dom';
import { routes } from '../../app/routes';

export function NotFoundPage() {
  return (
    <div className="panel state-panel">
      <h2>Page not found</h2>
      <p>This route does not exist in the learning workspace.</p>
      <Link className="button-primary" to={routes.overview}>
        Return home
      </Link>
    </div>
  );
}
