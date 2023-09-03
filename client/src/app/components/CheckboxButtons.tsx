import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
  items: string[];
  checked?: string[];
  onChange: (items: string[]) => void;
}
export default function CheckboxButtons({ items, checked, onChange }: Props) {
  const [checkedItems, setCheckedItems] = useState(checked || []);

  function handleChecked(option: string) {
    const currentIndex = checkedItems.findIndex(item => item === option);
    let newChecked: string[] = [];
    if (currentIndex === -1) {
      newChecked = [...checkedItems, option];
    } else {
      newChecked = checkedItems.filter(item => item !== option);
    }
    setCheckedItems(newChecked);
    onChange(newChecked);
  }
  return (
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel control={<Checkbox
          checked={checkedItems.indexOf(item) !== -1}
          onClick={() => handleChecked(item)}
        />
        } label={item} key={item} />
      ))}
    </FormGroup>
  );
}