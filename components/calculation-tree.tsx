'use client';

import { CalculationNode } from '@/lib/types';
import { Avatar } from '@/components/ui/avatar';

interface CalculationTreeProps {
  nodes: CalculationNode[];
  onRespond?: (node: CalculationNode) => void;
  canRespond?: boolean;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return (
    date.toLocaleDateString('de-DE') +
    ' @ ' +
    date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  );
}

function formatValue(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(4).replace(/\.?0+$/, '');
}

function getOperationSymbol(op: string | null): string {
  switch (op) {
    case '+': return '+';
    case '-': return '−';
    case '*': return '×';
    case '/': return '÷';
    default: return '';
  }
}

export function CalculationTree({ nodes, onRespond, canRespond }: CalculationTreeProps) {
  if (nodes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No calculations yet. Be the first to start a number discussion!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {nodes.map((node) => (
        <CalculationTreeNode
          key={node.id}
          node={node}
          depth={0}
          onRespond={onRespond}
          canRespond={canRespond}
        />
      ))}
    </div>
  );
}

interface CalculationTreeNodeProps {
  node: CalculationNode;
  depth: number;
  onRespond?: (node: CalculationNode) => void;
  canRespond?: boolean;
}

function CalculationTreeNode({ node, depth, onRespond, canRespond }: CalculationTreeNodeProps) {
  // Build the display text for this calculation
  const buildDisplayText = () => {
    if (node.operation && node.operand !== null) {
      // This is a response - show the operation that was performed
      const parentValue = calculateParentValue();
      return `${formatValue(parentValue)} ${getOperationSymbol(node.operation)} ${formatValue(node.operand)} = ${formatValue(node.value)}`;
    }
    // This is a root discussion - just show the starting value
    return `Started with: ${formatValue(node.value)}`;
  };

  // Calculate what the parent value was based on current value and operation
  const calculateParentValue = (): number => {
    if (!node.operation || node.operand === null) return node.value;
    switch (node.operation) {
      case '+': return node.value - node.operand;
      case '-': return node.value + node.operand;
      case '*': return node.value / node.operand;
      case '/': return node.value * node.operand;
      default: return node.value;
    }
  };

  return (
    <div
      className="animate-in fade-in-0 duration-300"
      style={{ marginLeft: depth > 0 ? `${Math.min(depth * 48, 144)}px` : 0 }}
    >
      <div className="border rounded-lg bg-card p-4 hover:shadow-sm transition-shadow">
        <div className="flex gap-4">
          {/* Avatar and Username */}
          <div className="flex flex-col items-center gap-1.5">
            <Avatar username={node.username} size="md" />
            <span className="text-xs text-muted-foreground font-medium text-center max-w-16 truncate">
              {node.username}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Timestamp */}
            <div className="text-xs text-purple-600 dark:text-purple-400 mb-2 font-medium">
              {formatDate(node.createdAt)}
            </div>

            {/* Calculation text */}
            <p className="text-foreground mb-3 text-sm sm:text-base">
              {buildDisplayText()}
            </p>

            {/* Reply button */}
            {canRespond && onRespond && (
              <button
                onClick={() => onRespond(node)}
                className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 text-sm font-semibold transition-colors cursor-pointer"
              >
                Reply
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Children (replies) */}
      {node.children && node.children.length > 0 && (
        <div className="mt-3 space-y-3">
          {node.children.map((child) => (
            <CalculationTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onRespond={onRespond}
              canRespond={canRespond}
            />
          ))}
        </div>
      )}
    </div>
  );
}
