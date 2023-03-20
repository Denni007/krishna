/* eslint-disable jsx-a11y/alt-text */
import PropTypes from 'prop-types';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
import { ToWords } from 'to-words';

// utils
import { fDate, fDatemonth } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
//
import styles from './InvoiceStyle';

// ----------------------------------------------------------------------

InvoicePDF.propTypes = {
  invoice: PropTypes.object,
};

export default function InvoicePDF({ invoice }) {
  const {
    items,
    status,
    dueDate,
    discount,
    invoiceTo,
    invoiceDate,
    invoiceAmount,
    invoiceFrom,
    invoiceNo,
    TotalAmount,
  } = invoice;
  const totalTaxAmount = (TotalAmount / 100) * (discount ? 95 : 100);
  const gst = (totalTaxAmount / 100) * 2.5;
  const toWords = new ToWords();

  return (
    <Document>
      <Page size="A4" style={styles.page}>


        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Invoice from</Text>
            <Text style={styles.body1}>Krishna Fashion</Text>
            <Text style={styles.body1}>167, Mahavir Nagar Society, Nr. Shyamdham </Text>
            <Text style={styles.body1}>Soc., Puna , Surat</Text>
            <Text style={styles.body1}>Phone: 9998023918</Text>
            <Text style={styles.body1}>GSR: 24AORPM2520C2Z9</Text>

          </View>

          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Invoice to</Text>
            <Text style={styles.body1}>{invoiceTo.clientName}</Text>
            <Text style={styles.body1}>{invoiceTo.address}</Text>
            <Text style={styles.body1}>{invoiceTo.phoneNumber}</Text>
          </View>
        </View>
        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Date create</Text>
            <Text style={styles.body1}>{fDate(invoiceDate)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Text style={styles.h3}>Bill No:  {`${invoiceNo}`}</Text>
            <Text style={styles.h3}>Bill Date: {`${fDate(invoiceDate)}`}</Text>
          </View>
        </View>
        {/* <View style={[styles.gridContainer, styles.mb40]}>
          
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Due date</Text>
            <Text style={styles.body1}>{fDate(dueDate)}</Text>
          </View>
        </View> */}

        <Text style={[styles.overline, styles.mb8]}>Invoice Details</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Challan No</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Challan Date</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Design</Text>
              </View>
             

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Short</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Plain</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Quantity</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Unit price</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.subtitle2}>Total</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            {items.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.challanNo}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{fDatemonth(item.challanDate)}</Text>
                </View>
                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>{item.designId}</Text>
                  <Text>{item.designName}</Text>
                </View>
               

                <View style={styles.tableCell_3}>
                  <Text>{item.short}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.plain}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.quantity}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item.price}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{fCurrency(item.total)}</Text>
                </View>
              </View>
            ))}
          </View>
          <View >
            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Total Amount</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(TotalAmount)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Discount</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{discount ? fCurrency(TotalAmount / 100) * 5 : 0}</Text>
              </View>
            </View>
            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Taxable Amount:</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(totalTaxAmount)}</Text>
              </View>
            </View>
            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>CGST</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(gst)}</Text>
              </View>
            </View>
            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>SGST</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(gst)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text style={styles.h4}>Total</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.h4}>{fCurrency(invoiceAmount)}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.gridContainer]}>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>NOTES</Text>
            <Text>
            {toWords.convert(invoiceAmount, { currency: true }).toUpperCase()}
            </Text>
          </View>
         
        </View>

        <View style={[styles.gridContainer, styles.footer]}>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>NOTES</Text>
            <Text>
              payment will be accepted only be A/C. Payee's Dreaft/Cheque
            </Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>For, Mr.Krishna Fashion</Text>
            <Text> {'\n'}</Text>
            <Text style={styles.subtitle2}>Authorized Sign</Text>


          </View>
        </View>
      </Page>
    </Document>
  );
}
