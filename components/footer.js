import styles from '../styles/Footer.module.scss'
import Containner from "./containner";
import Image from 'next/image'
import footerLogo from '../public/images/logo-big-t.png'
import Link from 'next/link';
import packageJson from '../package.json';

export default function Footer({footerText, menus}) {
    return <div className={"bg-gray-200 " + styles.footer}>
        <div className={"grid md:grid-cols-3 gap-y-10 " + styles.footerContainner}>



           {menus["footer-about-us"] && <div>
                <div className={styles.footerHeadTitle}>{menus["footer-about-us"]["title"]}</div>
                <div className='grid grid-cols-2 lg:grid-cols-3'>
                    {menus["footer-about-us"]["items"].map((col, key)=><div key={key} className={styles.footerDetail}>{col.children.data.map((item, key2)=><div key={key2} className='mb-6'>{item.attributes.url ? <a href={item.attributes.url} target={item.attributes.target}>{item.attributes.title}</a> : item.attributes.title}</div>)}</div>)}
                    {/* <div className={styles.footerDetail}> */}
                        {/* <Link href="/e-merit" >
                            <a >ทำบุญออนไลน์</a>
                        </Link>
                        <br /><br />
                        <Link href="/e-fortune" >
                            <a >เสี่ยงเซียมซีออนไลน์</a>
                        </Link><br /><br /> */}
                        {/* <Link href="/products" >
                            <a>สินค้ามงคล</a>
                        </Link> */}
                        {/* <br /><br /> */}
                        {/* <Link href="/e-donation" >
                            <a >บริจาค</a>
                        </Link> */}
                        {/* <br /><br /> */}
                        {/* <a href="https://facebook.com/thaimerit">ข่าวสาร</a>
                    </div> */}
                    {/* <div className={styles.footerDetail}>
                        <a href="https://facebook.com/thaimerit">เกี่ยวกับเรา</a><br /><br />
                        <a href="https://facebook.com/thaimerit">ร่วมงาน</a><br /><br />
                        <a href={"/pages/privacy"}>นโยบายความเป็นส่วนตัว</a><br /><br />
                        <a href="https://facebook.com/thaimerit">หางาน</a><br /><br />
                        <a href="https://facebook.com/thaimerit">ติดต่อเรา</a><br /><br />
                        <a href="https://facebook.com/thaimerit" target="_blank" rel="noreferrer">Facebook</a>
                    </div> */}
                </div>
            </div>}


            {menus["footer-need-help"] &&  <div>
                <div className={styles.footerHeadTitle}>{menus["footer-need-help"]["title"]}</div>
                <div className={styles.footerDetail}>
                    {menus["footer-need-help"]["items"].map((item, key)=><div key={key} className='mb-6'>{item.url ? <a href={item.url} target={item.target}>{item.title}</a> : item.title}</div>)}
                    {/* พร้อมให้ความช่วยเหลือ<br /><br />
                    จันทร์ - ศุกร์    9:00 - 17:00<br /><br />
                    เสาร์   9:00 - 13:00<br /><br />
                    โทรหาเรา +66 922 687075<br /><br />
                    อีเมล   <a href="mailto:support@thaimerit.com">support@thaimerit.com</a><br /><br />
                    Facebook   <a href="https://facebook.com/thaimerit" target="_blank" rel="noreferrer">Thaimerit</a> */}
                </div>
            </div>}
           
            <div>
                <div className={styles.footerHeadTitle}>ช่องทางติดตาม</div>
                <div className={styles.footerDetail}>
                    <Image src={footerLogo} className={styles.footerLogo} width="200px" height="200px" />
                </div>
            </div>
        </div>
            {footerText && <div className={styles.footerText}>
                {footerText.split("\n").map((text, key)=><div key={key} className='text-center'>{text}</div>)}
                {/* <div className='text-center'>
                    บริษัท ลัคกี้ เฮง เฮง จำกัด (สำนักงานใหญ่)
                </div>
                <div className='text-center'>
                    ที่อยู่ 99/10 อาคารซอฟต์แวร์ปาร์ค ชั้น 26 หมู่ที่ 4 ถ.แจ้งวัฒนะ  ต.คลองเกลือ อ.ปากเกร็ด จ.นนทบุรี 11120
                </div>
                <div className='text-center'>
                    โทร. 0893555678
                </div> */}
            </div>}
        <div className={styles.footerVersion}>v{packageJson.version} ({packageJson.version_date})</div>
    </div>
}