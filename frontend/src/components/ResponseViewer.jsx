import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

const ResponseViewer = ({ response, onClear }) => {
  const containerRef = useRef(null);
  const jsonRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [response]);

  // const formatResponse = (data) => {
  //   return JSON.stringify(data, null, 2);
  // };

  const syntaxHighlight = (json) => {
    if (typeof json !== "string") {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      function (match) {
        let cls = "json-number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "json-key";
          } else {
            cls = "json-string";
          }
        } else if (/true|false/.test(match)) {
          cls = "json-boolean";
        } else if (/null/.test(match)) {
          cls = "json-null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  };

  if (!response) return null;

  const getStatusColor = (status) => {
    return status === "success" ? "text-green-400" : "text-red-400";
  };

  const getStatusIcon = (status) => {
    return status === "success" ? "✅" : "❌";
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <div ref={containerRef} className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3
          className={`text-xl font-bold flex items-center space-x-3 ${getStatusColor(
            response.status
          )}`}
        >
          <span>{getStatusIcon(response.status)}</span>
          <span>Payment Response</span>
        </h3>
        <div className="flex space-x-3">
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-dark-card border border-dark-border text-gray-300 rounded-lg hover:bg-dark-border transition-colors duration-200 text-sm font-medium"
          >
            📋 Copy
          </button>
          <button
            onClick={onClear}
            className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200 text-sm font-medium"
          >
            ✕ Clear
          </button>
        </div>
      </div>

      {/* Success Message */}
      {response.status === "success" && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-semibold">
              Transaction Successful!
            </span>
          </div>
          {response.method && (
            <div className="mt-2 text-sm text-green-300">
              Method: <span className="font-mono">{response.method}</span>
            </div>
          )}
        </div>
      )}

      {/* JSON Response */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-300">Response Data</h4>
        <div className="bg-dark-bg border border-dark-border rounded-xl p-4 overflow-x-auto">
          <pre
            ref={jsonRef}
            className="text-sm font-mono text-gray-300 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: syntaxHighlight(response) }}
          />
        </div>
      </div>

      {/* Transaction Details */}
      {(response.txHash || response.gas || response.timestamp) && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-300">
            Transaction Details
          </h4>

          {response.txHash && (
            <div className="p-4 bg-dark-card border border-dark-border rounded-xl">
              <div className="text-sm font-medium text-gray-400 mb-2">
                Transaction Hash
              </div>
              <div className="font-mono text-sm text-neon-blue break-all">
                {response.txHash}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {response.gas && (
              <div className="p-4 bg-dark-card border border-dark-border rounded-xl">
                <div className="text-sm font-medium text-gray-400 mb-1">
                  Gas Used
                </div>
                <div className="text-neon-purple font-mono">{response.gas}</div>
              </div>
            )}

            {response.timestamp && (
              <div className="p-4 bg-dark-card border border-dark-border rounded-xl">
                <div className="text-sm font-medium text-gray-400 mb-1">
                  Timestamp
                </div>
                <div className="text-neon-pink font-mono text-sm">
                  {new Date(response.timestamp).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseViewer;
