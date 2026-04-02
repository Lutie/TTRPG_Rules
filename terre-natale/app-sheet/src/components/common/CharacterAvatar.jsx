import { useRef, useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';

const MAX_PX    = 200;
const MAX_INPUT_MB = 1;

function resizeToBase64(file, onSuccess, onError) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > MAX_PX || h > MAX_PX) {
        if (w >= h) { h = Math.round(h * MAX_PX / w); w = MAX_PX; }
        else        { w = Math.round(w * MAX_PX / h); h = MAX_PX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      onSuccess(canvas.toDataURL('image/webp', 0.88));
    };
    img.onerror = () => onError('Impossible de lire l\'image.');
    img.src = e.target.result;
  };
  reader.onerror = () => onError('Erreur de lecture du fichier.');
  reader.readAsDataURL(file);
}

export default function CharacterAvatar({ showLabel = true }) {
  const { character, updateCharacter } = useCharacter();
  const inputRef = useRef(null);
  const [error, setError]  = useState(null);
  const avatar = character.avatar || null;

  const handleFile = (file) => {
    if (!file) return;
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Format non supporté. Utilisez JPG, PNG, WebP…');
      return;
    }
    if (file.size > MAX_INPUT_MB * 1024 * 1024) {
      setError(`Fichier trop lourd (max ${MAX_INPUT_MB} Mo).`);
      return;
    }

    resizeToBase64(
      file,
      (b64) => updateCharacter(prev => ({ ...prev, avatar: b64 })),
      (msg) => setError(msg),
    );
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setError(null);
    updateCharacter(prev => ({ ...prev, avatar: null }));
  };

  return (
    <div className="info-avatar-col-inner">
      {showLabel && <label className="character-avatar-label">Portrait</label>}
      <div
        className={`character-avatar${avatar ? ' character-avatar--filled' : ''}${error ? ' character-avatar--error' : ''}`}
        onClick={() => { setError(null); inputRef.current?.click(); }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
        title={avatar ? 'Cliquer pour remplacer' : 'Cliquer pour ajouter un portrait'}
      >
        {avatar ? (
          <>
            <img src={avatar} alt="Portrait" className="character-avatar-img" />
            <div className="character-avatar-overlay">✎</div>
            <button className="character-avatar-remove" onClick={handleRemove} title="Retirer">×</button>
          </>
        ) : (
          <div className="character-avatar-empty">
            <span className="character-avatar-plus">+</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => { handleFile(e.target.files[0]); e.target.value = ''; }}
        />
      </div>
      {error && <p className="character-avatar-error">{error}</p>}
    </div>
  );
}
