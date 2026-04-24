import React, { useState } from 'react';

function JobForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    required_skills: [],
    years_experience: 1,
  });
  const [skillInput, setSkillInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.required_skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        required_skills: [...prev.required_skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      required_skills: prev.required_skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in job title and description');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Job Title *</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Senior Backend Engineer"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Job Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the role, responsibilities, and key requirements..."
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="years_experience">Years of Experience Required</label>
        <input
          id="years_experience"
          type="number"
          name="years_experience"
          value={formData.years_experience}
          onChange={handleChange}
          min="0"
          max="50"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="skill-input">Required Skills</label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            id="skill-input"
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            placeholder="Add a skill and press Enter or click Add"
            disabled={isLoading}
          />
          <button type="button" onClick={handleAddSkill} disabled={isLoading}>
            Add
          </button>
        </div>
        {formData.required_skills.length > 0 && (
          <div className="skills-input">
            {formData.required_skills.map((skill) => (
              <div key={skill} className="skill-tag">
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  disabled={isLoading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading ? 'Scouting Candidates...' : 'Scout Candidates'}
      </button>
    </form>
  );
}

export default JobForm;
