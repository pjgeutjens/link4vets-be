import { Suspense, lazy } from 'react';
import type { PartialRouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';
import BlogLayout from './components/blog/BlogLayout';
import DocsLayout from './components/docs/DocsLayout';
import LoadingScreen from './components/LoadingScreen';
import MainLayout from './components/MainLayout';

const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

// Blog pages

const BlogPostCreate = Loadable(lazy(() => import('./pages/blog/BlogPostCreate')));
const BlogPostDetails = Loadable(lazy(() => import('./pages/blog/BlogPostDetails')));
const BlogPostList = Loadable(lazy(() => import('./pages/blog/BlogPostList')));

// Docs pages

const Docs = Loadable(lazy(() => import('./pages/Docs')));

// Error pages

const AuthorizationRequired = Loadable(lazy(() => import('./pages/AuthorizationRequired')));
const NotFound = Loadable(lazy(() => import('./pages/NotFound')));
const ServerError = Loadable(lazy(() => import('./pages/ServerError')));

const Contact = Loadable(lazy(() => import('./pages/Contact')));
const Home = Loadable(lazy(() => import('./pages/Home')));

const routes: PartialRouteObject[] = [
  {
    path: 'blog',
    element: <BlogLayout />,
    children: [
      {
        path: '/',
        element: <BlogPostList />
      },
      {
        path: 'new',
        element: <BlogPostCreate />
      },
      {
        path: ':postId',
        element: <BlogPostDetails />
      }
    ]
  },
  {
    path: 'contact',
    element: <Contact />
  },
  {
    path: 'docs',
    element: <DocsLayout />,
    children: [
      {
        path: '/',
        element: (
          <Navigate
            to="/docs/overview/welcome"
            replace
          />
        )
      },
      {
        path: '*',
        element: <Docs />
      }
    ]
  },
  {
    path: '*',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '401',
        element: <AuthorizationRequired />
      },
      {
        path: '404',
        element: <NotFound />
      },
      {
        path: '500',
        element: <ServerError />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
];

export default routes;
