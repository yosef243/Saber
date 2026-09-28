import type { MemorialProfile } from '../types';

function wrapText(ctx: CanvasRenderingContext2D, value: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of value.split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(candidate).width > maxWidth) {
        lines.push(line);
        line = word;
      } else line = candidate;
    }
    if (line) lines.push(line);
  }
  return lines;
}

export async function shareDuaCard(
  title: string,
  prayer: string,
  source: string,
  profile: MemorialProfile | null
): Promise<'shared' | 'downloaded'> {
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.fillStyle = '#f4f9f4';
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = '#1e6f5c';
  ctx.fillRect(0, 0, 1080, 20);
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillStyle = '#1e6f5c';
  ctx.font = 'bold 56px Amiri, Georgia, serif';
  ctx.fillText(title, 540, 130, 920);

  let lines: string[] = [];
  let size = 54;
  while (size >= 30) {
    ctx.font = `${size}px Amiri, Georgia, serif`;
    lines = wrapText(ctx, prayer, 890);
    if (lines.length * size * 1.65 <= 620) break;
    size -= 2;
  }
  ctx.fillStyle = '#233441';
  const lineHeight = size * 1.65;
  let y = Math.max(240, 560 - ((lines.length - 1) * lineHeight) / 2);
  for (const line of lines) {
    ctx.fillText(line, 540, y, 900);
    y += lineHeight;
  }

  ctx.fillStyle = '#52636b';
  ctx.font = '32px system-ui, sans-serif';
  ctx.fillText(source, 540, 905, 920);
  if (profile) {
    ctx.font = 'bold 33px Amiri, Georgia, serif';
    ctx.fillText(`صدقة جارية عن روح ${profile.name}`, 540, 970, 920);
  } else {
    ctx.font = '32px Amiri, Georgia, serif';
    ctx.fillText('صدقة جارية عن موتانا وموتى المسلمين', 540, 970, 920);
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Image export failed')), 'image/png');
  });
  const file = new File([blob], 'saber-dua.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] }) && navigator.share) {
    await navigator.share({ files: [file], title });
    return 'shared';
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'saber-dua.png';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
  return 'downloaded';
}
