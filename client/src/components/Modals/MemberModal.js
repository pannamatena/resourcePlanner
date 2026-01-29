import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePlanner } from '../../context/PlannerContext';
import { COLOR_THEMES } from '../../utils/constants';
import * as S from '../../Style';

export const MemberModal = ({ member, onClose }) => {
  const { actions } = usePlanner();

  // Local state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    colorIdx: 0
  });

  useEffect(() => {
    if (member) {
      // Find index of existing color
      let colorIdx = COLOR_THEMES.findIndex(c => c.main === member.color.main);
      if (colorIdx === -1) colorIdx = 0;

      setFormData({
        name: member.name,
        role: member.role,
        colorIdx
      });
    } else {
      // Reset for add mode
      setFormData({ name: '', role: '', colorIdx: 0 });
    }
  }, [member]);

  const handleSave = () => {
    if (!formData.name) return alert("Name is required");

    const selectedColor = COLOR_THEMES[formData.colorIdx];

    if (member) {
      // Update
      actions.updateMember({
        ...member,
        name: formData.name,
        role: formData.role,
        color: selectedColor
      });
    } else {
      // Add
      actions.addMember({
        id: Date.now(),
        name: formData.name,
        role: formData.role || 'Contributor',
        color: selectedColor
      });
    }
    onClose();
  };

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={e => e.stopPropagation()}>
        <S.ModalHeader>
          <h3>{member ? 'Edit Member' : 'Add Team Member'}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </S.ModalHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <S.InputGroup>
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </S.InputGroup>
          <S.InputGroup>
            <label>Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            />
          </S.InputGroup>
          <S.InputGroup>
            <label>Color Theme</label>
            <S.ColorSwatchContainer>
              {COLOR_THEMES.map((theme, idx) => (
                <S.ColorSwatch
                  key={idx}
                  color={theme.main}
                  isSelected={formData.colorIdx === idx}
                  onClick={() => setFormData({...formData, colorIdx: idx})}
                />
              ))}
            </S.ColorSwatchContainer>
          </S.InputGroup>
          <S.ButtonRow>
            <div />
            <S.Button variant="primary" onClick={handleSave}>
              {member ? 'Save Changes' : 'Add Member'}
            </S.Button>
          </S.ButtonRow>
        </div>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};