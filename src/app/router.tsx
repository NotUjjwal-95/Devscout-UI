import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App, { ConceptMapPage, ExplanationPage, OverviewPage, PipelinePage, PlanPage, PracticePage, SourcesPage } from './App'
import { routes } from './routes'

export function AppRouter() {
  return <BrowserRouter><Routes>
    <Route element={<App />}>
      <Route path={routes.overview} element={<OverviewPage />} />
      <Route path={routes.pipeline} element={<PipelinePage />} />
      <Route path={routes.plan} element={<PlanPage />} />
      <Route path={routes.sources} element={<SourcesPage />} />
      <Route path={routes.explanation} element={<ExplanationPage />} />
      <Route path={routes.conceptMap} element={<ConceptMapPage />} />
      <Route path={routes.practice} element={<PracticePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes></BrowserRouter>
}

function NotFoundPage() {
  return <div className="panel mx-auto mt-12 max-w-xl text-center"><h2 className="text-2xl font-semibold">Page not found</h2><p className="mt-2 text-sm text-fog">That route does not exist in this learning workspace.</p><a className="button-primary mt-6 inline-flex" href={routes.overview}>Return home</a></div>
}
