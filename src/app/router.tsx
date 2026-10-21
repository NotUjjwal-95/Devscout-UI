import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import { routes } from './routes'
import { GoalPage } from '../features/learning-goal/GoalPage'
import { PipelinePage } from '../features/pipeline/PipelinePage'
import { PlanPage } from '../features/pipeline/PlanPage'
import { NotFoundPage } from '../features/learning-goal/NotFoundPage'
import { SourcesPage } from '../features/sources/SourcesPage'
import { ExplanationPage } from '../features/explanation/ExplanationPage'
import { ConceptMapPage } from '../features/concept-map/ConceptMapPage'
import { PracticeGatePage } from '../features/practice-gate/PracticeGatePage'

export function AppRouter() {
  return <BrowserRouter><Routes>
    <Route element={<App />}>
      <Route path={routes.overview} element={<GoalPage />} />
      <Route path={routes.pipeline} element={<PipelinePage />} />
      <Route path={routes.plan} element={<PlanPage />} />
      <Route path={routes.sources} element={<SourcesPage />} />
      <Route path={routes.explanation} element={<ExplanationPage />} />
      <Route path={routes.conceptMap} element={<ConceptMapPage />} />
      <Route path={routes.practice} element={<PracticeGatePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes></BrowserRouter>
}
