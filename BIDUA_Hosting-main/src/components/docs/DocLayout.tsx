import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ExternalLink } from 'lucide-react';

interface DocLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: { label: string; path?: string }[];
  nextPage?: { title: string; path: string };
  prevPage?: { title: string; path: string };
}

export function DocLayout({
  children,
  title,
  description,
  breadcrumbs = [],
  nextPage,
  prevPage
}: DocLayoutProps) {
  return (
    <div className="doc-content">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
          <Link to="/" className="hover:text-cyan-500">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/docs" className="hover:text-cyan-500">Documentation</Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4" />
              {crumb.path ? (
                <Link to={crumb.path} className="hover:text-cyan-500">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-900 font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Title and Description */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{title}</h1>
        {description && (
          <p className="text-lg text-slate-600">{description}</p>
        )}
      </div>

      {/* Main Content */}
      <div className="prose prose-slate max-w-none">
        {children}
      </div>

      {/* Navigation Footer */}
      {(prevPage || nextPage) && (
        <div className="mt-12 pt-8 border-t border-slate-200 flex items-center justify-between">
          {prevPage ? (
            <Link
              to={prevPage.path}
              className="flex items-center space-x-2 text-slate-600 hover:text-cyan-500 transition group"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
              <div>
                <div className="text-sm text-slate-500">Previous</div>
                <div className="font-medium group-hover:text-cyan-500">{prevPage.title}</div>
              </div>
            </Link>
          ) : <div />}

          {nextPage && (
            <Link
              to={nextPage.path}
              className="flex items-center space-x-2 text-slate-600 hover:text-cyan-500 transition group text-right"
            >
              <div>
                <div className="text-sm text-slate-500">Next</div>
                <div className="font-medium group-hover:text-cyan-500">{nextPage.title}</div>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 bg-cyan-50 border border-cyan-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Need Help?</h3>
        <p className="text-slate-600 mb-4">
          If you have any questions or need assistance, feel free to reach out to our support team.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
          >
            <span>Contact Support</span>
            <ExternalLink className="h-4 w-4" />
          </Link>
          <Link
            to="/dashboard/support"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            <span>Open Ticket</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
