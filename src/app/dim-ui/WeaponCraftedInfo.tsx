import { t } from 'app/i18next-t';
import { DimCrafted } from 'app/inventory/item-types';
import { percentWithSingleDecimal } from 'app/shell/formatters';

/**
 * A progress bar that shows weapon crafting info like the game does.
 */
export function WeaponCraftedInfo({
  craftInfo,
  className,
}: {
  craftInfo: DimCrafted;
  className: string;
}) {
  const pct = percentWithSingleDecimal(craftInfo.progress || 0);
  const progressBarStyle = {
    width: pct,
  };

  return (
    <div className={className}>
      <div className="objective-progress">
        <div className="objective-progress-bar" style={progressBarStyle} />
        <div className="objective-description">
          {t('MovePopup.WeaponLevel', { level: craftInfo.level })}
        </div>
        <div className="objective-text">{pct}</div>
      </div>
    </div>
  );
}
