import React, { Fragment } from "react";
import { UX2 } from "@wsb/guac-widget-core";

const styles = {
  eyebrow: {
    marginBottom: "xsmall",
    textTransform: "uppercase",
  },
  priceRowLeft: {
    display: "flex",
    flexDirection: "column",
  },
  priceRowRight: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  eventDate: {
    marginTop: "xxsmall",
  },
  footer: {
    marginTop: "small",
  },
  button: {
    marginTop: "xsmall",
  },
};

export function CommerceCardContent({
  name,
  duration,
  eventDate,
  price,
  salePrice,
  priceText,
  productType,
  eyebrowText,
  isTwoLabelsEyebrowEnabled,
  eyebrowLabel1 = {},
  eyebrowLabel2 = {},
  lineBreakEyebrow,
  footerText,
  footerAlert,
  ratings,
  colors,
  renderColorsLabel,
  cardSize,
  cardType,
  isBoxed,
  dataAids = {},
  dataRoutes = {},
  buttonText,
  isPriceShown,
  isImageShown,
  linkText,
  linkCategory,
  isPriceFeatured,
  style,
  hasImage,
  titleProps,
  ratingsAlignLeft,
  strikeThroughPrice,
  renderInventoryWarning,
  ...props
}) {
  const layoutStyles =
    !hasImage && isBoxed
      ? {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          marginVertical: "large",
        }
      : {};

  const dividerStyles = lineBreakEyebrow
    ? null
    : {
        ":not(:last-child)": {
          marginRight: "xsmall",
          paddingRight: "xsmall",
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderColor: "ultraLowContrast",
          "@xs-only":
            eyebrowLabel1?.text && eyebrowLabel2?.text
              ? {
                  marginBottom: "xsmall",
                  marginRight: "0",
                  paddingRight: "0",
                  borderRightWidth: "0",
                }
              : null,
        },
      };

  const twoLabelsStyles = {
    label: {
      textTransform: "uppercase",
      textAlign: "left",
      marginBottom: "xsmall",
      lineHeight: "1",
      ...dividerStyles,
    },
    container: {
      display: "flex",
      flexDirection: lineBreakEyebrow ? "column" : "row",
      paddingBottom: "small",
      "@xs-only":
        eyebrowLabel1?.text && eyebrowLabel2?.text
          ? {
              flexDirection: "column",
            }
          : {
              justifyContent: "left",
            },
    },
  };

  const componentStyles = this.merge(
    {
      position: "relative",
      paddingHorizontal: isBoxed ? "small" : "0",
      paddingBottom: isBoxed && hasImage ? "medium" : "0",
      ...layoutStyles,
    },
    style
  );

  const PriceRowComponent =
    isPriceShown && ratings ? UX2.Element.Block : Fragment;

  const priceRowProps = isPriceShown &&
    ratings && {
      style: ratingsAlignLeft ? styles.priceRowLeft : styles.priceRowRight,
    };

  const hasColors = Boolean(colors?.length);
  const isSingleMobileColumn = cardSize?.xs === "large";

  const inventoryWarning = renderInventoryWarning
    ? renderInventoryWarning()
    : null;

  const content = (
    <>
      {inventoryWarning}
      {eyebrowText && !isTwoLabelsEyebrowEnabled && (
        <UX2.Element.Details.Minor
          style={styles.eyebrow}
          data-aid={dataAids.eyebrow}
        >
          {eyebrowText}
        </UX2.Element.Details.Minor>
      )}

      {isTwoLabelsEyebrowEnabled && (
        <UX2.Element.Block style={twoLabelsStyles.container}>
          {eyebrowLabel1.text && (
            <UX2.Element.Details.Minor
              data-aid={eyebrowLabel1.dataAid}
              children={eyebrowLabel1.text}
              hidden={!eyebrowLabel1.text}
              style={twoLabelsStyles.label}
            />
          )}

          {eyebrowLabel2.text && (
            <UX2.Element.Details.Minor
              data-aid={eyebrowLabel2.dataAid}
              children={eyebrowLabel2.text}
              hidden={!eyebrowLabel2.text}
              style={twoLabelsStyles.label}
            />
          )}
        </UX2.Element.Block>
      )}

      <UX2.Component.CommerceCardTitle
        title={name}
        isDigitalProduct={productType === "digital"}
        dataAids={dataAids}
        {...titleProps}
      />
      {eventDate && (
        <UX2.Element.Details.Minor
          style={styles.eventDate}
          data-aid={dataAids.eventDate}
        >
          {eventDate}
        </UX2.Element.Details.Minor>
      )}
      <PriceRowComponent {...priceRowProps}>
        {isPriceShown && (
          <UX2.Component.CommerceCardPriceDisplay
            price={price}
            salePrice={salePrice}
            priceText={priceText}
            duration={duration}
            isLinkShown={Boolean(linkText)}
            cardType={cardType}
            dataAids={dataAids}
            isPriceFeatured={isPriceFeatured}
            strikeThroughPrice={strikeThroughPrice}
            styles={{ marginRight: ratings ? "xxsmall" : "0" }}
          />
        )}
        {ratings && <UX2.Element.Block>{ratings}</UX2.Element.Block>}
      </PriceRowComponent>
      {hasColors && (
        <UX2.Component.CommerceCardColors
          colors={colors}
          renderColorsLabel={renderColorsLabel}
          isSingleMobileColumn={isSingleMobileColumn}
          data-aid={dataAids.colorSwatches}
        />
      )}
      {footerText && (
        <UX2.Element.Details.Minor
          style={styles.footer}
          data-aid={dataAids.footer}
          alert={footerAlert}
        >
          {footerText}
        </UX2.Element.Details.Minor>
      )}
      {buttonText && (
        <UX2.Element.Button.Spotlight
          style={styles.button}
          data-aid={dataAids.button}
          data-route={dataRoutes.button}
        >
          {buttonText}
        </UX2.Element.Button.Spotlight>
      )}
      {linkText && (
        <UX2.Element.MoreLink
          category={linkCategory}
          section={isImageShown ? "overlay" : "default"}
          tag="span"
        >
          {linkText}
        </UX2.Element.MoreLink>
      )}
    </>
  );

  return this.Block(
    this.merge(
      {
        children: content,
        style: componentStyles,
      },
      props
    )
  );
}
