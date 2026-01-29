import styled from '@emotion/styled';

export const DAY_WIDTH = 40;

export const Container = styled.div`
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #1e293b;
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

// --- NEW: LEGEND STYLES ---
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
  /* Dynamic color based on type */
  background-color: ${props => {
  if (props.type === 'US') return '#fecaca'; // Red-200
  if (props.type === 'IE') return '#bbf7d0'; // Green-200
  if (props.type === 'UK') return '#bfdbfe'; // Blue-200
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

  &:hover {
    border-color: #4f46e5;
    color: #4f46e5;
    background-color: #eef2ff;
  }
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

  input {
    border: none;
    font-family: inherit;
    color: #0f172a;
    font-weight: 500;
    outline: none;
    cursor: pointer;
    background: transparent;
  }
  
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

  svg {
    color: #4f46e5;
  }
`;

export const PlannerLayout = styled.div`
  display: flex;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background-color: white;
  overflow: hidden;
  height: 600px;
`;

export const Sidebar = styled.div`
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid #e2e8f0;
  background-color: #f8fafc;
  z-index: 30;
  box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

export const SidebarRow = styled.div`
  height: ${props => props.isHeader ? '80px' : '64px'};
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: ${props => props.isHeader ? '#f1f5f9' : 'transparent'};
  font-weight: ${props => props.isHeader ? '600' : 'normal'};
  color: ${props => props.isHeader ? '#475569' : 'inherit'};
  
  &:hover .actions { opacity: 1; }
  &:hover { background-color: ${props => !props.isHeader && 'white'}; }
`;

export const ActionBtnGroup = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
`;

export const ActionBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || '#64748b'}; 
  &:hover {
    background-color: ${props => props.hoverBg || '#f1f5f9'};
    color: ${props => props.hoverColor || '#0f172a'};
  }
`;

export const AddMemberBtn = styled.button`
  margin: 16px;
  padding: 8px;
  border: 1px dashed #cbd5e1;
  background: white;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  &:hover { border-color: #4f46e5; color: #4f46e5; background: #eef2ff; }
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
  background-color: ${props => props.color ? props.color.main : '#6366f1'};
`;

export const TimelineScrollArea = styled.div`
  flex: 1;
  overflow-x: auto;
  position: relative;
`;

export const TimelineContent = styled.div`
  width: ${props => props.totalDays * DAY_WIDTH}px; 
`;

export const TimelineHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.totalDays}, ${DAY_WIDTH}px);
  height: 80px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f1f5f9;
  position: sticky;
  top: 0;
  z-index: 20;
`;

// UPDATED: Handle holiday colors
export const DayHeaderCell = styled.div`
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 8px;
  font-size: 0.70rem;
  color: #64748b;
  font-weight: 600;
  position: relative;
  
  /* Background Logic: Holiday > Weekend > Transparent */
  background-color: ${props => {
  if (props.holidayType === 'US') return '#fee2e2'; // Red-100
  if (props.holidayType === 'IE') return '#dcfce7'; // Green-100
  if (props.holidayType === 'UK') return '#dbeafe'; // Blue-100
  if (props.isWeekend) return '#e2e8f0';
  return 'transparent';
}};

  /* Top Border for Holiday Indication */
  border-top: ${props => {
  if (props.holidayType === 'US') return '4px solid #ef4444';
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

export const TimelineRow = styled.div`
  position: relative;
  height: 64px;
  border-bottom: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: repeat(${props => props.totalDays}, ${DAY_WIDTH}px);
  background-color: white;
`;

// UPDATED: Handle holiday colors in the grid
export const GridCell = styled.div`
  border-right: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background-color 0.2s;
  
  /* Background Logic: Holiday > Weekend > Sprint > Transparent */
  background-color: ${props => {
  if (props.holidayType === 'US') return '#fef2f2'; // Red-50
  if (props.holidayType === 'IE') return '#f0fdf4'; // Green-50
  if (props.holidayType === 'UK') return '#eff6ff'; // Blue-50
  if (props.isWeekend) return '#f1f5f9';
  if (props.isSprintStart) return '#f8fafc';
  return 'transparent';
}};
  
  border-left: ${props => props.isSprintStart ? '2px solid #e2e8f0' : 'none'};
  
  &:hover { background-color: #e0e7ff; }
`;

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
  
  left: calc(${props => props.startIndex * DAY_WIDTH}px + 2px);
  width: calc(${props => props.duration * DAY_WIDTH}px - 4px);
  display: ${props => props.isHidden ? 'none' : 'flex'};

  background-color: ${props => props.color ? props.color.bg : '#e0e7ff'};
  border-color: ${props => props.color ? props.color.main : '#818cf8'};
  color: ${props => props.color ? props.color.main : '#3730a3'};
  z-index: 5;
  &:hover { filter: brightness(0.96); z-index: 6; }
  &:active { cursor: grabbing; }
`;

export const ResizeHandle = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 12px;
  cursor: col-resize;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background-color: rgba(0,0,0,0.05); }
  &::after { content: ''; height: 12px; width: 2px; border-left: 2px dotted rgba(0,0,0,0.2); }
`;

// ... Modals unchanged ...
export const ModalOverlay = styled.div`
  position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center; z-index: 50;
`;
export const ModalContent = styled.div`
  background: white; border-radius: 8px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); width: 384px; padding: 24px;
`;
export const ModalHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
  h3 { font-size: 1.125rem; font-weight: 700; margin: 0; }
  button { background: none; border: none; cursor: pointer; color: #94a3b8; &:hover { color: #475569; } }
`;
export const InputGroup = styled.div`
  margin-bottom: 16px;
  label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
  input, select { width: 100%; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px; font-size: 0.875rem; box-sizing: border-box; }
`;
export const ButtonRow = styled.div`
  display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 16px;
`;
export const Button = styled.button`
  padding: 8px 16px; border-radius: 4px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: none;
  ${props => props.variant === 'danger' && `color: #ef4444; background: none; &:hover { color: #b91c1c; }`}
  ${props => props.variant === 'primary' && `background-color: #4f46e5; color: white; &:hover { background-color: #4338ca; }`}
`;
export const ColorSwatchContainer = styled.div`
  display: flex; gap: 8px;
`;
export const ColorSwatch = styled.div`
  width: 24px; height: 24px; border-radius: 50%; background-color: ${props => props.color}; cursor: pointer;
  border: 2px solid ${props => props.isSelected ? '#1e293b' : 'transparent'};
  &:hover { transform: scale(1.1); }
`;

// Add these to your existing Style.js

export const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
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
`;

export const MemberRole = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;