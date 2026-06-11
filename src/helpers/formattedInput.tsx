
interface FormattedInputProps {
  id: string;
  name: string;
  value: number | string;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  style?: React.CSSProperties;
}

const formatNombre = (val: number | string): string => {
  const num = Number(String(val).replace(/\s/g, ''));
  return isNaN(num) ? '' : num.toLocaleString('fr-FR');
};

const FormattedInput: React.FC<FormattedInputProps> = ({
  id,
  name,
  value,
  onChange,
  readOnly = false,
  style = {}
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ligne = e.target.value.replace(/\s/g, '');
    const valeurNumerique = parseFloat(ligne) || 0;
    if (onChange) onChange(valeurNumerique);
  };

  return (
    <input
      type="text"
      id={id}
      name={name}
      style={{ width: '150px', textAlign: 'right', ...style }}
      value={formatNombre(value)}
      onChange={readOnly ? undefined : handleChange}
      readOnly={readOnly}
    />
  );
};

export default FormattedInput;
