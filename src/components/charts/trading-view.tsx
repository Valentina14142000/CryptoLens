"use client";

import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget({ symbol = 'BINANCE:BTCUSDT' }: { symbol?: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    el.innerHTML = '';
    const widget = document.createElement('div');
    widget.className = 'tradingview-widget-container__widget h-full w-full';
    el.appendChild(widget);
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com',
    });
    el.appendChild(script);
    return () => {
      el.innerHTML = '';
    };
  }, [symbol]);

  return <div className="tradingview-widget-container h-[380px] sm:h-[500px] w-full" ref={container} />;
}

export default memo(TradingViewWidget);
