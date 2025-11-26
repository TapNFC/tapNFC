'use client';

import { Suspense, useEffect, useState } from 'react';
import { AcceptInviteForm } from './AcceptInviteForm';

export default function AcceptInvitePage() {
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Extract token from hash fragment
    const hash = window.location.hash;
    if (hash) {
      // Remove the # and parse the parameters
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      if (token) {
        setInviteToken(token);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-gray-600">Loading invite...</p>
        </div>
      </div>
    );
  }

  if (!inviteToken) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Invalid Invite Link</h1>
          <p className="mb-4 text-gray-600">
            This invite link is missing the required authentication token. This usually happens when:
          </p>
          <ul className="mb-4 space-y-1 text-left text-sm text-gray-500">
            <li>• The link was copied incorrectly</li>
            <li>• The invite has expired</li>
            <li>• The link was accessed directly without proper parameters</li>
          </ul>
          <p className="text-gray-600">
            Please check your email for the complete invite link, or contact the person who sent you the invitation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 dark:from-gray-950 dark:to-gray-900">
        <div className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-5">
          <div className="size-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjIwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjQwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iY3VycmVudENvbG9yIi8+PHJlY3QgeD0iMzAwIiB5PSIxMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJjdXJyZW50Q29sb3IiLz48cmVjdCB5PSIyMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJjdXJyZW50Q29sb3IiLz48cmVjdCB4PSIyMDAiIHk9IjIwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjQwMCIgeT0iMjAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iY3VycmVudENvbG9yIi8+PHJlY3QgeD0iMzAwIiB5PSIzMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJjdXJyZW50Q29sb3IiLz48cmVjdCB4PSIxMDAiIHk9IjQwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxyZWN0IHg9IjMwMCIgeT0iNDAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+')]" />
        </div>

        <AcceptInviteForm token={inviteToken} />
      </div>
    </Suspense>
  );
}
