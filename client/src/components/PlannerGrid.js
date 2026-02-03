import React from 'react';
import {Plus, Trash2, Pencil, ArrowUp, ArrowDown} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { TimelineHeader } from './Timeline/TimelineHeader';
import { TimelineRow } from './Timeline/TimelineRow';
import * as S from '../Style';

export const PlannerGrid = ({ onEditMember, onAddMember, onEditTask, onAddTask }) => {
  const { team, actions, totalDays } = usePlanner();

  const handleDeleteMember = (id) => {
    if (window.confirm("Delete this member?")) {
      actions.deleteMember(id);
    }
  };

  return (
    <S.PlannerLayout>

      {/* 1. Sticky Corners & Headers */}
      <S.SidebarHeader>Team Member</S.SidebarHeader>
      <TimelineHeader />

      {/* 2. Main Data Loop (Renders Left & Right cells together) */}
      {team.map((member, index) => {
        const isFirst = index === 0;
        const isLast = index === team.length - 1;

        return (
          <React.Fragment key={member.id}>

            {/* LEFT: Sidebar Cell */}
            <S.SidebarCell>
              <div
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1, minWidth: 0 }}
              >
                <S.Avatar color={member.color}>{member.name.charAt(0)}</S.Avatar>
                <S.MemberInfo>
                  <S.MemberName title={member.name}>{member.name}</S.MemberName>
                  <S.MemberRole title={member.role}>{member.role}</S.MemberRole>
                </S.MemberInfo>
              </div>
              <S.ActionBtnGroup className="actions">
                <S.ActionBtn title="Edit" hoverBg="#e0e7ff" hoverColor="#4f46e5" onClick={() => onEditMember(member)}>
                  <Pencil size={14} />
                </S.ActionBtn>
                <S.ActionBtn title="Delete" hoverBg="#fee2e2" hoverColor="#ef4444" onClick={() => handleDeleteMember(member.id)}>
                  <Trash2 size={14} />
                </S.ActionBtn>
                <S.ActionBtn
                  onClick={() => actions.moveMember(member.id, 'up')}
                  disabled={isFirst}
                  style={{ opacity: isFirst ? 0.3 : 1, cursor: isFirst ? 'default' : 'pointer' }}
                  title="Move Up"
                >
                  <ArrowUp size={14} />
                </S.ActionBtn>

                <S.ActionBtn
                  onClick={() => actions.moveMember(member.id, 'down')}
                  disabled={isLast}
                  style={{ opacity: isLast ? 0.3 : 1, cursor: isLast ? 'default' : 'pointer' }}
                  title="Move Down"
                >
                  <ArrowDown size={14} />
                </S.ActionBtn>
              </S.ActionBtnGroup>
            </S.SidebarCell>

            {/* RIGHT: Timeline Row */}
            <TimelineRow
              member={member}
              onEditTask={onEditTask}
              onAddTask={onAddTask}
            />

          </React.Fragment>
        );
      })}

      {/* 3. Bottom "Add Member" Row */}
      <S.SidebarCell style={{ borderBottom: 'none' }}>
        <S.AddMemberBtn onClick={onAddMember} style={{ margin: 0, width: '100%' }}>
          <Plus size={16} /> Add Member
        </S.AddMemberBtn>
      </S.SidebarCell>
      {/* Empty Timeline Cell to balance the grid */}
      <S.TimelineRow style={{ borderBottom: 'none' }} totalDays={totalDays} />

    </S.PlannerLayout>
  );
};