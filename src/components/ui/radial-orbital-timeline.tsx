"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  onNodeClick?: (id: number) => void;
}

export default function RadialOrbitalTimeline({
  timelineData,
  onNodeClick,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [viewMode, setViewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    const isCurrentlyExpanded = expandedItems[id];
    const willExpand = !isCurrentlyExpanded;

    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });
      newState[id] = willExpand;
      return newState;
    });

    if (willExpand) {
      setActiveNodeId(id);
      setAutoRotate(false);

      const relatedItems = getRelatedItems(id);
      const newPulseEffect: Record<number, boolean> = {};
      relatedItems.forEach((relId) => {
        newPulseEffect[relId] = true;
      });
      setPulseEffect(newPulseEffect);

      centerViewOnNode(id);
      if (onNodeClick) onNodeClick(id);
    } else {
      setActiveNodeId(null);
      setAutoRotate(true);
      setPulseEffect({});
    }
  };

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 280;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-lime-400 bg-lime-400/10 border-lime-400 [box-shadow:0_0_10px_rgba(163,230,53,0.5)]";
      case "in-progress":
        return "text-[#00e5ff] bg-[#ef233c]/10 border-[#ef233c] [box-shadow:0_0_10px_rgba(0,229,255,0.5)]";
      case "pending":
        return "text-neutral-500 bg-black/40 border-neutral-700";
      default:
        return "text-white bg-black/40 border-white/50";
    }
  };

  const getStatusText = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "UNLOCKED";
      case "in-progress":
        return "CURRENT QUEST";
      case "pending":
        return "LOCKED";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <div
      className="w-full h-[800px] flex flex-col items-center justify-center bg-transparent overflow-hidden font-mono"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Cyber Core */}
          <div className="absolute w-32 h-32 rotate-45 border-4 border-[#ef233c] bg-black shadow-[0_0_50px_rgba(239,35,60,0.8)] animate-pulse flex items-center justify-center z-10 before:absolute before:inset-2 before:border-2 before:border-fuchsia-500 after:absolute after:inset-4 after:bg-gradient-to-br after:from-[#ef233c] after:to-fuchsia-600">
            <div className="-rotate-45 text-white font-black z-20 tracking-widest text-sm [text-shadow:0_0_5px_white]">CORE</div>
          </div>
          <div className="absolute w-[600px] h-[600px] border-[1px] border-dashed border-white/20 rounded-full animate-[spin_60s_linear_infinite]"></div>
          <div className="absolute w-[400px] h-[400px] border-[1px] border-dotted border-red-500/30 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>

          <div className="absolute w-[560px] h-[560px] rounded-full border border-[#ef233c]/20 shadow-[inset_0_0_50px_rgba(239,35,60,0.1)]"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef233c] focus-visible:ring-offset-4 focus-visible:ring-offset-[transparent] rounded-full"
                style={nodeStyle}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-label={`View details for ${item.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleItem(item.id);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full -inset-1 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(239,35,60,0.3) 0%, rgba(239,35,60,0) 70%)`,
                    width: `${item.energy * 0.8 + 64}px`,
                    height: `${item.energy * 0.8 + 64}px`,
                    left: `-${(item.energy * 0.8) / 2}px`,
                    top: `-${(item.energy * 0.8) / 2}px`,
                  }}
                ></div>

                <div
                  className={`
                  w-16 h-16 flex items-center justify-center rotate-45
                  ${
                    isExpanded
                      ? "bg-[#ef233c] text-white shadow-[0_0_30px_rgba(239,35,60,0.8)]"
                      : isRelated
                      ? "bg-black text-[#ef233c] shadow-[inset_0_0_15px_rgba(239,35,60,0.5)]"
                      : "bg-black text-white/50"
                  }
                  border-2 
                  ${
                    isExpanded
                      ? "border-white"
                      : isRelated
                      ? "border-[#ef233c] animate-pulse"
                      : "border-white/20"
                  }
                  transition-all duration-300 transform hover:scale-125 hover:border-[#ef233c] hover:text-[#ef233c]
                  ${isExpanded ? "scale-125" : ""}
                `}
                >
                  <div className="-rotate-45">
                    <Icon size={28} />
                  </div>
                </div>

                <div
                  className={`
                  absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap
                  text-[10px] font-black tracking-[0.2em] uppercase
                  transition-all duration-300 bg-black/80 px-2 py-1 border border-white/10
                  ${isExpanded ? "text-white scale-110 border-[#ef233c] shadow-[0_0_10px_rgba(239,35,60,0.5)]" : "text-white/50"}
                `}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="absolute top-28 left-1/2 -translate-x-1/2 w-80 bg-black/95 backdrop-blur-xl border-[#ef233c] overflow-visible rounded-none [box-shadow:4px_4px_0_rgba(239,35,60,0.5)]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-[#ef233c]"></div>
                    {/* Cyber UI Corners */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ef233c]"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#ef233c]"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#ef233c]"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ef233c]"></div>

                    <CardHeader className="pb-2">
                       <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                        <Badge
                          className={`px-2 py-0 text-[10px] font-black rounded-sm border ${getStatusStyles(
                            item.status
                          )}`}
                        >
                          {getStatusText(item.status)}
                        </Badge>
                        <span className="text-[10px] font-mono font-bold tracking-widest text-[#ef233c]">
                          [{item.date}]
                        </span>
                      </div>
                      <CardTitle className="text-lg font-black uppercase tracking-widest text-white [text-shadow:2px_2px_0_#ef233c]">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-white/80 font-mono">
                      <p className="leading-relaxed border-l-2 border-[#ef233c]/50 pl-3 my-2">{item.content}</p>

                      <div className="mt-6 pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-neutral-400 mb-2">
                          <span className="flex items-center text-orange-500">
                            <Zap size={12} className="mr-1" />
                            NODE_ENERGY
                          </span>
                          <span className="text-white">{item.energy}%</span>
                        </div>
                        <div className="w-full h-2 bg-black border border-white/20 overflow-hidden p-[1px]">
                          <div
                            className="h-full bg-gradient-to-r from-[#ef233c] to-orange-500 shadow-[0_0_10px_#ef233c]"
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-white/10">
                          <div className="flex items-center mb-3">
                            <Link size={12} className="text-[#ef233c] mr-1" />
                            <h4 className="text-[10px] uppercase tracking-widest font-black text-[#ef233c]">
                              AVAIL_PATHS
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (i) => i.id === relatedId
                              );
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  aria-label={`View connected path: ${relatedItem?.title}`}
                                  className="flex items-center h-7 px-3 py-0 text-[10px] font-black uppercase tracking-widest rounded-none border border-white/20 bg-black hover:bg-[#ef233c]/20 hover:border-[#ef233c] text-white transition-all shadow-[2px_2px_0_rgba(255,255,255,0.1)] hover:shadow-[2px_2px_0_#ef233c] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef233c]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight
                                    size={10}
                                    className="ml-2 text-[#ef233c]"
                                    aria-hidden="true"
                                  />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
