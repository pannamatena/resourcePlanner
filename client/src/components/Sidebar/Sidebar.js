import React from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { usePlanner } from '../../context/PlannerContext';
import * as S from '../../Style';

export const Sidebar = ({ onEditMember, onAddMember }) => {
  const { team, actions } = usePlanner();

  const handleDelete = (id) => {
    if (window.confirm("Delete this member? All their assigned tasks will also be removed.")) {
      actions.deleteMember(id);
    }
  };

  return (
    <S.Sidebar>
      <S.SidebarHeader>Team Member</S.SidebarHeader>

      {/* Scrollable list of members */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {team.map(member => (
          <S.SidebarCell key={member.id}>
            <div
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1, minWidth: 0 }}
              onClick={() => onEditMember(member)}
            >
              <S.Avatar color={member.color}>
                {member.name.charAt(0)}
              </S.Avatar>

              <S.MemberInfo>
                <S.MemberName title={member.name}>{member.name}</S.MemberName>
                <S.MemberRole title={member.role}>{member.role}</S.MemberRole>
              </S.MemberInfo>
            </div>

            <S.ActionBtnGroup className="actions">
              <S.ActionBtn hoverBg="#e0e7ff" hoverColor="#4f46e5" onClick={() => onEditMember(member)}>
                <Pencil size={14} />
              </S.ActionBtn>
              <S.ActionBtn hoverBg="#fee2e2" hoverColor="#ef4444" onClick={() => handleDelete(member.id)}>
                <Trash2 size={14} />
              </S.ActionBtn>
            </S.ActionBtnGroup>
          </S.SidebarCell>
        ))}
      </div>

      {/* Fixed Add Button at bottom */}
      <S.SidebarCell style={{ borderBottom: 'none' }}>
        <S.AddMemberBtn onClick={onAddMember} style={{ margin: 0, width: '100%' }}>
          <Plus size={16} /> Add Member
        </S.AddMemberBtn>
      </S.SidebarCell>
    </S.Sidebar>
  );
};