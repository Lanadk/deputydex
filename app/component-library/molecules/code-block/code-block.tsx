"use client"

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {SpanLib} from "@/app/component-library/atoms/span/span-lib";

interface CodeBlockProps {
    /** Code in string format */
    code: string;
    /** Component preview */
    children: React.ReactNode;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, children }) => {
    const [isCodeVisible, setIsCodeVisible] = useState(false);

    return (
        <div className="border border-main bg-card rounded-lg p-6 mb-6">
            {/* Preview */}
            <div className="mb-4">
                {children}
            </div>

            {/* Toggle button */}
            <SpanLib
                onClick={() => setIsCodeVisible(!isCodeVisible)}
            >
                {isCodeVisible ? '▼ Hide Code' : '▶ Show Code'}
            </SpanLib>

            {/* Code Block */}
            {isCodeVisible && (
                <div className="rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                        language="tsx"
                        style={vscDarkPlus}
                        customStyle={{
                            margin: 0,
                            padding: '1rem',
                            fontSize: '0.875rem',
                        }}
                    >
                        {code}
                    </SyntaxHighlighter>
                </div>
            )}
        </div>
    );
};