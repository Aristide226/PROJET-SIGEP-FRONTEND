import { FunctionComponent } from 'react';

interface Props {
  value: any;
}

const CellWithTooltip: FunctionComponent<Props> = ({value}) => {
  if (!value) return null;
  
  return (
    <div 
      title={String(value)} 
      style={{ 
        whiteSpace: 'nowrap', 
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {value}
    </div>
  );
};

export default CellWithTooltip;
