import React, { useRef } from 'react';
import { Download, Upload, Calendar } from 'lucide-react';
import { usePlanner } from '../../context/PlannerContext';
import * as S from '../../Style'; // Adjust path to where you kept Style.js

export const Header = () => {
  const {
    viewRange,
    setViewRange,
    team,
    tasks,
    actions
  } = usePlanner();

  const fileInputRef = useRef(null);

  // --- Export Logic ---
  const handleExport = () => {
    const dataStr = JSON.stringify({ team, tasks, version: 1 }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // --- Import Logic ---
  const triggerImport = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (json.team && Array.isArray(json.team) && json.tasks && Array.isArray(json.tasks)) {
          if(window.confirm("This will overwrite your current data. Continue?")) {
            actions.importData(json.team, json.tasks);
          }
        } else {
          alert("Invalid file format. Missing team or tasks data.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  return (
    <S.Header>
      <S.HeaderLeft>
        <S.Title><Calendar size={24} /> Resource Planner</S.Title>
        <S.LegendContainer>
          <span style={{ fontWeight: 600, marginRight: 4 }}>Bank Holidays:</span>
          <S.LegendItem><S.LegendSwatch type="US"/> <span>USA</span></S.LegendItem>
          <S.LegendItem><S.LegendSwatch type="IE"/> <span>Ireland</span></S.LegendItem>
          <S.LegendItem><S.LegendSwatch type="UK"/> <span>UK</span></S.LegendItem>
        </S.LegendContainer>
      </S.HeaderLeft>

      <S.HeaderControls>
        <S.DateRangePicker>
          <span>From:</span>
          <input
            type="date"
            value={viewRange.start}
            onChange={(e) => setViewRange({...viewRange, start: e.target.value})}
          />
          <span>To:</span>
          <input
            type="date"
            value={viewRange.end}
            onChange={(e) => setViewRange({...viewRange, end: e.target.value})}
          />
        </S.DateRangePicker>

        <S.ButtonGroup>
          <S.HeaderBtn onClick={handleExport}>
            <Download size={16} /> Export
          </S.HeaderBtn>
          <S.HeaderBtn onClick={triggerImport}>
            <Upload size={16} /> Import
          </S.HeaderBtn>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".json"
            onChange={handleImportFile}
          />
        </S.ButtonGroup>
      </S.HeaderControls>
    </S.Header>
  );
};