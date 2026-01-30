import styled from '@emotion/styled';

export const DAY_WIDTH = 40;

// GLOBAL RESET for this component's children to prevent layout math errors
export const Container = styled.div`
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #1e293b;
  box-sizing: border-box;
  
  * {
    box-sizing: border-box;
  }
`;

export const Header = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const HeaderControls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const LegendContainer = styled.div`
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 4px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const LegendSwatch = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => {
  if (props.type === 'US') return '#F8F6EBFF';
  if (props.type === 'IE') return '#bbf7d0';
  if (props.type === 'UK') return '#bfdbfe';
  return '#ccc';
}};
  border: 1px solid rgba(0,0,0,0.1);
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  padding-left: 16px;
  border-left: 1px solid #e2e8f0;
`;

export const HeaderBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: #4f46e5; color: #4f46e5; background-color: #eef2ff; }
`;

export const DateRangePicker = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 6px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #475569;
  input { border: none; font-family: inherit; color: #0f172a; font-weight: 500; outline: none; cursor: pointer; background: transparent; }
  span { color: #94a3b8; }
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #0f172a;
  svg { color: #4f46e5; }
`;

/* --- LAYOUT GRID --- */

export const PlannerLayout = styled.div`
  display: grid;
  /* Fixed Sidebar | Scrollable Timeline */
  grid-template-columns: 220px max-content; 
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background-color: white;
  overflow: auto; /* Unified scroll */
  height: 600px;
  position: relative;
`;

export const SidebarHeader = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  z-index: 50;
  width: 220px;
  height: 80px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-weight: 600;
  color: #475569;
`;

export const TimelineHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 40;
  height: 80px;
  background-color: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
`;

export const SidebarCell = styled.div`
  position: sticky;
  left: 0;
  z-index: 30;
  width: 220px;
  height: 64px;
  background-color: #fff;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  transition: background-color 0.2s;
  
  &:hover .actions { opacity: 1; }
  &:hover { background-color: #f8fafc; }
`;

export const TimelineRow = styled.div`
  height: 64px;
  border-bottom: 1px solid #e2e8f0;
  background-color: white;
  display: flex;
  position: relative;
`;

/* --- COMPONENTS --- */

export const TodayLabel = styled.span`
  font-size: 0.6rem;
  text-transform: uppercase;
  font-weight: 800;
  color: #ef4444; /* Red Text */
  margin-bottom: 2px;
  letter-spacing: 0.5px;
`;

export const DayHeaderCell = styled.div`
  width: ${DAY_WIDTH}px;
  flex-shrink: 0;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 8px;
  font-size: 0.70rem;
  font-weight: 600;
  position: relative;
  
  /* Text Color */
  color: ${props => {
  if (props.isToday) return '#ef4444'; // Red
  if (props.isWeekend) return '#475569';
  return '#64748b';
}};
  
  /* Background Color */
  background-color: ${props => {
  if (props.isToday) return '#fee2e2'; // Light Red Bg
  if (props.holidayType === 'US') return '#F8F6EBFF';
  if (props.holidayType === 'IE') return '#dcfce7';
  if (props.holidayType === 'UK') return '#dbeafe';
  if (props.isWeekend) return '#e2e8f0';
  return 'transparent';
}};

  /* Top Border Highlight */
  border-top: ${props => {
  if (props.isToday) return '4px solid #ef4444'; // Red Top Border
  if (props.holidayType === 'US') return '4px solid #efd944';
  if (props.holidayType === 'IE') return '4px solid #22c55e';
  if (props.holidayType === 'UK') return '4px solid #3b82f6';
  return 'none';
}};

  border-left: ${props => props.isSprintStart ? '2px solid #6366f1' : 'none'};

  &::before {
    content: '${props => props.sprintLabel}';
    display: ${props => props.sprintLabel ? 'block' : 'none'};
    position: absolute;
    top: 8px;
    left: 4px;
    white-space: nowrap;
    font-size: 0.75rem;
    font-weight: 800;
    color: #4f46e5;
    background: #e0e7ff;
    padding: 2px 6px;
    border-radius: 4px;
    z-index: 10;
  }
`;

export const GridCell = styled.div`
  width: ${DAY_WIDTH}px;
  flex-shrink: 0;
  border-right: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background-color 0.2s;
  
  /* Column Background */
  background-color: ${props => {
  if (props.isToday) return '#fef2f2'; // Very Light Red
  if (props.holidayType === 'US') return '#F8F6EBFF';
  if (props.holidayType === 'IE') return '#f0fdf4';
  if (props.holidayType === 'UK') return '#eff6ff';
  if (props.isWeekend) return '#f1f5f9';
  if (props.isSprintStart) return '#f8fafc';
  return 'transparent';
}};
  
  /* Vertical Marker Line */
  border-left: ${props => {
  if (props.isToday) return '2px solid #f87171'; // Solid Red Line
  if (props.isSprintStart) return '2px solid #e2e8f0';
  return 'none';
}};

  &:hover { background-color: #e0e7ff; }
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  margin-right: 8px;
  flex-shrink: 0;
  background-color: ${props => props.color ? props.color.main : '#6366f1'};
`;

/* --- FIXED: MEMBER INFO --- */
export const MemberInfo = styled.div`
  display: flex;
  flex-direction: column; /* This ensures Role is below Name */
  justify-content: center;
  line-height: 1.3;
  flex: 1; 
  min-width: 0;
  margin-right: 4px;
`;

export const MemberName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`;

export const MemberRole = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`;

/* ... Rest of the components ... */
export const ActionBtnGroup = styled.div` display: flex; gap: 4px; opacity: 0; transition: opacity 0.2s; `;
export const ActionBtn = styled.button` background: none; border: none; cursor: pointer; padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: ${props => props.color || '#64748b'}; &:hover { background-color: ${props => props.hoverBg || '#f1f5f9'}; color: ${props => props.hoverColor || '#0f172a'}; } `;
export const AddMemberBtn = styled.button` margin: 16px; padding: 8px; border: 1px dashed #cbd5e1; background: white; color: #64748b; border-radius: 6px; cursor: pointer; font-size: 0.875rem; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; &:hover { border-color: #4f46e5; color: #4f46e5; background: #eef2ff; } `;

export const TaskBar = styled.div`
  position: absolute;
  top: 12px;
  bottom: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid;
  cursor: grab;
  display: flex;
  align-items: center;
  padding: 0 8px;
  overflow: hidden;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  
  /* Positioning */
  left: calc(${props => props.startIndex * DAY_WIDTH}px + 2px);
  width: calc(${props => props.duration * DAY_WIDTH}px - 4px);
  display: ${props => props.isHidden ? 'none' : 'flex'};
  z-index: 5;

  /* --- DYNAMIC STYLING --- */
  ${props => props.isOOO ? `
    /* Out of Office Style: Diagonal Stripes */
    background-image: repeating-linear-gradient(
      45deg,
      #f8fafc,
      #f8fafc 10px,
      #e2e8f0 10px,
      #e2e8f0 20px
    );
    background-color: #f8fafc;
    border-color: #cbd5e1;
    color: #64748b;
    font-style: italic;
  ` : `
    /* Standard Task Style */
    background-color: ${props.color ? props.color.bg : '#e0e7ff'};
    border-color: ${props.color ? props.color.main : '#818cf8'};
    color: ${props.color ? props.color.main : '#3730a3'};
  `}

  &:hover {
    filter: brightness(0.96);
    z-index: 6;
  }
  
  &:active {
    cursor: grabbing;
  }
`;
export const ResizeHandle = styled.div` position: absolute; right: 0; top: 0; bottom: 0; width: 12px; cursor: col-resize; z-index: 20; display: flex; align-items: center; justify-content: center; &:hover { background-color: rgba(0,0,0,0.05); } &::after { content: ''; height: 12px; width: 2px; border-left: 2px dotted rgba(0,0,0,0.2); } `;
export const ModalOverlay = styled.div` position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 50; `;
export const ModalContent = styled.div` background: white; border-radius: 8px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); width: 384px; padding: 24px; `;
export const ModalHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; h3 { font-size: 1.125rem; font-weight: 700; margin: 0; } button { background: none; border: none; cursor: pointer; color: #94a3b8; &:hover { color: #475569; } } `;
export const InputGroup = styled.div` margin-bottom: 16px; label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; } input, select { width: 100%; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px; font-size: 0.875rem; box-sizing: border-box; } `;
export const ButtonRow = styled.div` display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 16px; `;
export const Button = styled.button` padding: 8px 16px; border-radius: 4px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: none; ${props => props.variant === 'danger' && `color: #ef4444; background: none; &:hover { color: #b91c1c; }`} ${props => props.variant === 'primary' && `background-color: #4f46e5; color: white; &:hover { background-color: #4338ca; }`} `;
export const ColorSwatchContainer = styled.div` display: flex; gap: 8px; `;
export const ColorSwatch = styled.div` width: 24px; height: 24px; border-radius: 50%; background-color: ${props => props.color}; cursor: pointer; border: 2px solid ${props => props.isSelected ? '#1e293b' : 'transparent'}; &:hover { transform: scale(1.1); } `;