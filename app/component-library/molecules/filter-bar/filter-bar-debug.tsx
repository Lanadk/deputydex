'use client';

import React from 'react';
import {FilterBarQuery} from "@/app/component-library/molecules/filter-bar/filter-bar.types";

interface FilterBarDebugProps {
    query: FilterBarQuery;
}

export const FilterBarDebug: React.FC<FilterBarDebugProps> = ({query}) => {
    return (
        <div className="fb-debug">
            <div className="fb-debug__header">
                <span className="fb-debug__title">Prisma Query</span>
                <div className="fb-debug__pills">
                    {query.orderBy.length > 0 && (
                        <span className="fb-debug__pill fb-debug__pill--order">
              orderBy · {query.orderBy.length}
            </span>
                    )}
                </div>
            </div>

            <pre className="fb-debug__body">
                {JSON.stringify(query, null, 2)}
            </pre>

            <div className="fb-debug__usage">
                <span className="fb-debug__usage-label">Usage</span>
                <pre className="fb-debug__usage-code">
                    {`prisma.user.findMany({
                    ${Object.keys(query.where ?? {}).length > 0
                        ? `  where: ${JSON.stringify(query.where, null, 2).replace(/\n/g, '\n  ')},\n`
                        : ""}
                    ${query.orderBy?.length
                        ? `  orderBy: ${JSON.stringify(query.orderBy, null, 2).replace(/\n/g, '\n  ')}`
                        : ""}
                    })`}
                </pre>
            </div>

            <style>{`
                .fb-debug {
                  border-radius: 10px;
                  border: 1px solid #e2e8f0;
                  overflow: hidden;
                  font-family: system-ui, sans-serif;
                }
        
                .fb-debug__header {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 10px 14px;
                  background: #f8fafc;
                  border-bottom: 1px solid #e2e8f0;
                }
        
                .fb-debug__title {
                  font-size: 11px;
                  font-weight: 700;
                  letter-spacing: 0.08em;
                  text-transform: uppercase;
                  color: #64748b;
                }
        
                .fb-debug__pills {
                  display: flex;
                  gap: 6px;
                }
        
                .fb-debug__pill {
                  font-size: 10px;
                  font-weight: 600;
                  padding: 2px 8px;
                  border-radius: 20px;
                }
        
                .fb-debug__pill--order {
                  background: #dbeafe;
                  color: #1d4ed8;
                }
        
                .fb-debug__pill--where {
                  background: #dcfce7;
                  color: #15803d;
                }
        
                .fb-debug__body {
                  margin: 0;
                  padding: 12px 14px;
                  font-size: 12px;
                  font-family: 'JetBrains Mono', 'Fira Code', monospace;
                  color: #334155;
                  background: #fff;
                  line-height: 1.7;
                  border-bottom: 1px solid #e2e8f0;
                  white-space: pre-wrap;
                  word-break: break-all;
                }
        
                .fb-debug__usage {
                  padding: 10px 14px;
                  background: #0f172a;
                }
        
                .fb-debug__usage-label {
                  display: block;
                  font-size: 10px;
                  font-weight: 600;
                  letter-spacing: 0.08em;
                  text-transform: uppercase;
                  color: #475569;
                  margin-bottom: 6px;
                }
        
                .fb-debug__usage-code {
                  margin: 0;
                  font-size: 12px;
                  font-family: 'JetBrains Mono', 'Fira Code', monospace;
                  color: #7dd3fc;
                  line-height: 1.7;
                  white-space: pre-wrap;
                  word-break: break-all;
                }
      `}</style>
        </div>
    );
};