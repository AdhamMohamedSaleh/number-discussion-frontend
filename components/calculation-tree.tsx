'use client';

import { CalculationNode } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconPlus, IconMinus, IconX, IconDivide } from '@tabler/icons-react';

interface CalculationTreeProps {
  nodes: CalculationNode[];
  onRespond?: (node: CalculationNode) => void;
  canRespond?: boolean;
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
    <div className="space-y-6">
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
  const getOperationIcon = (op: string | null) => {
    switch (op) {
      case '+': return <IconPlus className="size-4" />;
      case '-': return <IconMinus className="size-4" />;
      case '*': return <IconX className="size-4" />;
      case '/': return <IconDivide className="size-4" />;
      default: return null;
    }
  };

  const formatValue = (value: number) => {
    if (Number.isInteger(value)) return value.toString();
    return value.toFixed(4).replace(/\.?0+$/, '');
  };

  return (
    <div className={depth > 0 ? 'ml-6 border-l-2 border-border pl-4' : ''}>
      <Card className="mb-3">
        <CardContent className="py-3 px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {node.operation && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  {getOperationIcon(node.operation)}
                  <span className="text-sm">{node.operand}</span>
                  <span className="text-sm">=</span>
                </div>
              )}
              <span className="text-2xl font-bold text-primary">
                {formatValue(node.value)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                by <span className="font-medium text-foreground">{node.username}</span>
              </span>
              {canRespond && onRespond && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRespond(node)}
                >
                  Respond
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {node.children && node.children.length > 0 && (
        <div className="space-y-2">
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
