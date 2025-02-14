import { ownedItemsSelector } from 'app/inventory/selectors';
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import BungieImage from '../../dim-ui/BungieImage';
import styles from '../../vendors/VendorItems.m.scss';
import D1VendorItem from './D1VendorItem';
import { Vendor, VendorCost } from './vendor.service';

/**
 * Display the items for a single vendor, organized by category.
 */
export default function D1VendorItems({
  vendor,
  totalCoins,
}: {
  vendor: Vendor;
  totalCoins: {
    [currencyHash: number]: number;
  };
}) {
  const allCurrencies: { [hash: number]: VendorCost['currency'] } = {};
  const ownedItemHashes = useSelector(ownedItemsSelector);

  vendor.allItems.forEach((saleItem) => {
    saleItem.costs.forEach((cost) => {
      allCurrencies[cost.currency.itemHash] = cost.currency;
    });
  });

  return (
    <div className={styles.vendorContents}>
      {!_.isEmpty(allCurrencies) && (
        <div className={styles.currencies}>
          {Object.values(allCurrencies).map((currency) => (
            <div className={styles.currency} key={currency.itemHash}>
              {totalCoins?.[currency.itemHash] || 0}{' '}
              <BungieImage src={currency.icon} title={currency.itemName} />
            </div>
          ))}
        </div>
      )}
      <div className={styles.itemCategories}>
        {_.map(vendor.categories, (category) => (
          <div className={styles.vendorRow} key={category.index}>
            <h3 className={styles.categoryTitle}>{category.title || 'Unknown'}</h3>
            <div className={styles.vendorItems}>
              {_.sortBy(category.saleItems, (i) => i.item.name).map((item) => (
                <D1VendorItem
                  key={item.index}
                  saleItem={item}
                  owned={ownedItemHashes.has(item.item.hash)}
                  totalCoins={totalCoins}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
